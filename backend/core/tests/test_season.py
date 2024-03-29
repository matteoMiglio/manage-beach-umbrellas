from django.test import TestCase
from ..models.season import Season

class SeasonModelTestCase(TestCase):
    def setUp(self):
        self.season2024 = Season.objects.create(
            season='2024',
            start_date='2024-06-01',
            end_date='2024-09-30',
            active=True,
        )
        self.season2023 = Season.objects.create(
            season='2023',
            start_date='2023-05-01',
            end_date='2023-09-30',
            active=False,
        )

    def test_season_creation(self):
        self.assertTrue(isinstance(self.season2024, Season))
        self.assertTrue(isinstance(self.season2023, Season))
        self.assertEqual(self.season2024.season, '2024')
        self.assertEqual(self.season2023.season, '2023')
        self.assertEqual(self.season2024.start_date, '2024-06-01')
        self.assertEqual(self.season2023.start_date, '2023-05-01')
        self.assertEqual(self.season2024.end_date, '2024-09-30')
        self.assertEqual(self.season2023.end_date, '2023-09-30')
        self.assertTrue(self.season2024.active)
        self.assertFalse(self.season2023.active)

    def test_default_values(self):
        season_with_defaults = Season.objects.create(
            season='2022',
            start_date='2022-06-01',
            end_date='2022-09-30',
        )
        self.assertFalse(season_with_defaults.active)

    # def test_unique_active_field(self):
    #     another_season_active = Season.objects.create(
    #         season='2025',
    #         start_date='2025-06-01',
    #         end_date='2025-09-30',
    #         active=True,
    #     )
    #     active_seasons_count = Season.objects.filter(active=True).count()
    #     self.assertEqual(active_seasons_count, 1)
