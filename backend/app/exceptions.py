from fastapi import HTTPException, status


class AppError:
    INVALID_PASSWORD_ERROR = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate current password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_CREDENTIALS_ERROR = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_SUBDOMAIN_CREDENTIALS_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Action to this subdomain is not allowed.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INSUFFICIENT_PERMISSION_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permissions to execute this action.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USERNAME_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Username already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    EMAIL_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Email already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    SUBDOMAIN_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Subdomain already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    CATEGORY_NAME_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Category already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="User blog already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_POST_CATEGORY_ASSOCIATION_ALREADY_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="User blog category association already exists",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_ARGUMENT_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid arguments provided.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    PASSWORD_MISMATCH_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Password and repeat password are not identical",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_DOES_NOT_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User blog does not exist",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_POST_DOES_NOT_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User blog post does not exist",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_CATEGORY_DOES_NOT_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User blog category does not exist",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_BLOG_CATEGORY_ASSOCIATION_DOES_NOT_EXISTS_ERROR = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User blog post category association does not exist",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_EMAIL_NOT_VERIFIED_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="User email not verified yet",
        headers={"WWW-Authenticate": "Bearer"},
    )

    USER_EMAIL_ALREADY_VERIFIED_ERROR = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User email is already verified",
        headers={"WWW-Authenticate": "Bearer"},
    )

    INVALID_EMAIL_VERIFICATION_TOKEN = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email verification token is invalid",
        headers={"WWW-Authenticate": "Bearer"},
    )

    ACCOUNT_ALREADY_VERIFIED = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Account is already verified",
        headers={"WWW-Authenticate": "Bearer"},
    )
