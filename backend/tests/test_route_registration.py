import os
import unittest


os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("SECRET_KEY", "route-registration-test")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("APP_NAME", "Biashara HUB test")

from app.main import app
from app.api.v1.router.social_account import router as social_account_router


class RouteRegistrationTests(unittest.TestCase):
    def test_social_account_delete_route_uses_handler_parameter(self):
        routes = [
            route
            for route in social_account_router.routes
            if route.path == "/api/social-account/{social_account_id}"
            and "DELETE" in route.methods
        ]

        self.assertEqual(len(routes), 1)


if __name__ == "__main__":
    unittest.main()