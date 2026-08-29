import os
import sys
import jwt
import datetime
import secrets
from functools import wraps
from flask import request, jsonify

DEV_DEFAULT_SECRET = "voidxhub-dev-secret-change-in-production"
SECRET_KEY = os.environ.get("VOIDXHUB_SECRET", DEV_DEFAULT_SECRET)
IS_PRODUCTION = os.environ.get("VOIDXHUB_ENV") == "production"

# Refuse to boot with the dev secret in production — this is the #1 way JWT
# auth gets silently broken: anyone who reads the public source code (or this
# repo) knows the default and can forge admin tokens against a real deployment
# that never set VOIDXHUB_SECRET.
if IS_PRODUCTION and SECRET_KEY == DEV_DEFAULT_SECRET:
    sys.exit(
        "FATAL: VOIDXHUB_ENV=production but VOIDXHUB_SECRET is not set.\n"
        "Set a real secret before starting the server, e.g.:\n"
        "  export VOIDXHUB_SECRET=\"$(python3 -c 'import secrets; print(secrets.token_hex(32))')\"\n"
    )

TOKEN_EXP_HOURS = 24 * 7


def generate_secret():
    """Run this once to produce a real secret for your .env / host's env vars."""
    return secrets.token_hex(32)


def issue_token(user_row):
    payload = {
        "user_id": user_row["id"],
        "username": user_row["username"],
        "role": user_row["role"],
        # token_version ties every token to the user's current version number.
        # Bumping token_version in the DB (e.g. on password change, or an
        # admin "log out everywhere" action) instantly invalidates every
        # token issued before that, even though JWTs are normally stateless.
        "tv": user_row["token_version"] if "token_version" in user_row.keys() else 0,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXP_HOURS),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_token_from_request():
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[7:]
    return None


def _token_version_matches(payload):
    """Re-check the token's version number against the DB so a password
    change, a manual 'log out everywhere', or a compromised-account response
    can invalidate tokens immediately instead of waiting up to 7 days."""
    from db import get_db
    conn = get_db()
    row = conn.execute(
        "SELECT token_version FROM users WHERE id=?", (payload.get("user_id"),)
    ).fetchone()
    conn.close()
    if row is None:
        return False
    return row["token_version"] == payload.get("tv", 0)


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"error": "Login required"}), 401
        payload = decode_token(token)
        if not payload or not _token_version_matches(payload):
            return jsonify({"error": "Session expired, please log in again"}), 401
        request.user = payload
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"error": "Login required"}), 401
        payload = decode_token(token)
        if not payload or not _token_version_matches(payload):
            return jsonify({"error": "Session expired, please log in again"}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "Admin access only"}), 403
        request.user = payload
        return f(*args, **kwargs)
    return wrapper
