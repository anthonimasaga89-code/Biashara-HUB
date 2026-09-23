#register all of your models here

from app.core.database import Base
from app.models.user import User
from app.models.revokedtoken import ReVoked
from app.models.business import Business



__all__=["Base","User","ReVoked","Business"]