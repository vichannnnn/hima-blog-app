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
    payload = jsonable_encoder(test_blog_insert)
    response = test_logged_in_client.post(BLOG_URL, json=payload)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == 1
    assert response.json()["title"] == test_blog_insert.title
    assert response.json()["content"] == test_blog_insert.content
    assert response.json()["last_edited_date"] is None


def test_get_blog_posts(
        test_client: TestClient, test_blog_insert: schemas.core.BlogCreateRequestModel
) -> None:
    response = test_client.get(BLOGS_URL)
    assert response.status_code == status.HTTP_200_OK
    assert not len(response.json())


def test_insert_two_blog_posts_and_blog_posts(
        create_valid_user,
        test_logged_in_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
        test_blog_insert_with_category: schemas.core.BlogCreateRequestModel,
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    response = test_logged_in_client.post(BLOG_URL, json=payload)

    assert response.status_code == status.HTTP_200_OK

    payload = jsonable_encoder(test_blog_insert_with_category)
    response = test_logged_in_client.post(BLOG_URL, json=payload)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == 2
    assert response.json()["category"] == test_blog_insert_with_category.category
    assert response.json()["last_edited_date"] is None

    response = test_logged_in_client.get(BLOGS_URL)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 2
    assert response.json()[0]["blog_id"] == 1
    assert response.json()[1]["blog_id"] == 2
    assert response.json()[0]["category"] is None
    assert response.json()[1]["category"] == test_blog_insert_with_category.category


def test_get_one_blog_post_not_valid(
        create_valid_user, test_client: TestClient
) -> None:
    response = test_client.get(BLOG_URL + "/" + str(1))
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_one_blog_post_valid(
        create_valid_user,
        test_logged_in_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    post_response = test_logged_in_client.post(BLOG_URL, json=payload)
    assert post_response.status_code == status.HTTP_200_OK

    blog_id = post_response.json()["blog_id"]

    response = test_logged_in_client.get(BLOG_URL + "/" + str(blog_id))
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == blog_id
    assert response.json()["title"] == test_blog_insert.title


def test_update_blog(
        create_valid_user,
        test_logged_in_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
        test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:

    payload = jsonable_encoder(test_blog_insert)
    response = test_logged_in_client.post(BLOG_URL, json=payload)
    assert response.status_code == status.HTTP_200_OK
    blog_id = response.json()["blog_id"]

    payload = jsonable_encoder(test_blog_update.dict(exclude_unset=True))
    response = test_logged_in_client.put(BLOG_URL + "/" + str(blog_id), json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["blog_id"] == blog_id
    assert response.json()["title"] == test_blog_update.title
    assert response.json()["content"] == test_blog_update.content
    assert response.json()["last_edited_date"] is not None


def test_update_blog_not_found(
        create_valid_user,
        test_logged_in_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
        test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    response = test_logged_in_client.post(BLOG_URL, json=payload)
    assert response.status_code == status.HTTP_200_OK

    payload = jsonable_encoder(test_blog_update)
    response = test_logged_in_client.put(BLOG_URL + "/" + str(2), json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_blog_not_authorized(
        test_client: TestClient,
        test_blog_update: schemas.core.BlogUpdateRequestModel,
) -> None:

    payload = jsonable_encoder(test_blog_update)
    response = test_client.put(BLOG_URL + "/" + str(2), json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_blog(
        create_valid_user,
        test_logged_in_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    response = test_logged_in_client.post(BLOG_URL, json=payload)
    assert response.status_code == status.HTTP_200_OK

    exist_blog_id = 1
    response = test_logged_in_client.delete(BLOG_URL + "/" + str(exist_blog_id))
    assert response.status_code == status.HTTP_204_NO_CONTENT

    does_not_exist_id = 2
    response = test_logged_in_client.delete(BLOG_URL + "/" + str(does_not_exist_id))
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_blog_unauthorized(
        test_client: TestClient,
        test_blog_insert: schemas.core.BlogCreateRequestModel,
) -> None:
    payload = jsonable_encoder(test_blog_insert)
    response = test_client.post(BLOG_URL, json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED