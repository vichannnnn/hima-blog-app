import uuid
from starlette.datastructures import UploadFile
import os


async def save_file(file: UploadFile, folder: str) -> str:
    file_id = uuid.uuid4().hex

    file.filename = f"{file_id}-{file.filename}"

    with open(os.path.join(folder, file.filename), "wb") as f:
        content = await file.read()
        f.write(content)
    return file.filename
