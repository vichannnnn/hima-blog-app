from fastapi import status
from fastapi.testclient import TestClient
from app import schemas
from fastapi.encoders import jsonable_encoder

BLOG_URL = "/blog"
BLOGS_URL = "/blogs"


def test_add_blog_unauthorized(
    test_client: TestClient, test_blog_insert: schemas.core.BlogCreateRequestModel
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    response = test_client.post(BLOG_URL, json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_add_blog_authorized(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    payload = test_blog_insert.dict(exclude_none=True)

    response = test_logged_in_client.post(BLOG_URL, params=payload)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == 1
    assert response.json()["title"] == test_blog_insert.title
    assert response.json()["content"] == test_blog_insert.content
    assert response.json()["last_edited_date"]


def test_get_blog_posts(
    test_client: TestClient, test_blog_insert: schemas.core.BlogCreateRequestModel
) -> None:
    response = test_client.get(BLOGS_URL)
    assert response.status_code == status.HTTP_200_OK
    assert not response.json()['items']


def test_insert_two_blog_posts_and_blog_posts(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
    test_blog_insert_with_category: schemas.core.BlogCreateRequestModel,
) -> None:
    response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert.dict(exclude_none=True)
    )

    assert response.status_code == status.HTTP_200_OK

    response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert_with_category.dict(exclude_none=True)
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == 2
    assert response.json()["category"] == test_blog_insert_with_category.category
    assert response.json()["last_edited_date"]

    response = test_logged_in_client.get(BLOGS_URL)
    assert response.status_code == status.HTTP_200_OK

    assert len(response.json()['items']) == 2


def test_get_one_blog_post_not_valid(
    create_valid_user, test_client: TestClient
) -> None:
    response = test_client.get(BLOG_URL + "/" + 'abc')
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_one_blog_post_valid(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    post_response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert.dict(exclude_unset=True)
    )
    assert post_response.status_code == status.HTTP_200_OK

    slug = post_response.json()["slug"]

    response = test_logged_in_client.get(BLOG_URL + "/" + str(slug))
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["slug"] == slug
    assert response.json()["title"] == test_blog_insert.title


def test_update_blog(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
    test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:
    response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_200_OK
    slug = response.json()["slug"]
    response = test_logged_in_client.put(
        BLOG_URL + "/" + str(slug), params=test_blog_update.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == test_blog_update.title
    assert response.json()["content"] == test_blog_update.content
    assert response.json()["last_edited_date"] is not None


def test_update_blog_not_found(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
    test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:
    response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_200_OK

    response = test_logged_in_client.put(
        BLOG_URL + "/" + 'something-else', params=test_blog_update.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_blog_not_authorized(
    test_client: TestClient,
    test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:
    response = test_client.put(
        BLOG_URL + "/" + str('abc'), params=test_blog_update.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_blog(
    create_valid_user,
    test_logged_in_client: TestClient,
    test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    response = test_logged_in_client.post(
        BLOG_URL, params=test_blog_insert.dict(exclude_none=True)
    )
    assert response.status_code == status.HTTP_200_OK

    response = test_logged_in_client.delete(BLOG_URL + "/" + response.json()['slug'])
    assert response.status_code == status.HTTP_204_NO_CONTENT

    does_not_exist_slug = 'abc'
    response = test_logged_in_client.delete(BLOG_URL + "/" + does_not_exist_slug)
    assert response.status_code == status.HTTP_404_NOT_FOUND


