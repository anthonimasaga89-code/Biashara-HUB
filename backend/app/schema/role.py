import enum
from sqlalchemy import Enum


class RoleCheck(str,enum.Enum):
    bussiness_owner="bussiness_owner",
    customer="customer"
    creator="creator"