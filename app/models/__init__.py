#register all of your models here

from app.core.database import Base
from app.models.user import User
from app.models.revokedtoken import ReVoked
from app.models.role import Role
from app.models.business import Business
from app.models.business_member import BusinessMember



__all__=["Base","User","ReVoked","Role","Business","BusinessMember",]