from django.test import TestCase
from ..models.season import Season
from ..models.umbrella import Umbrella

class UmbrellaModelTestCase(TestCase):
    def setUp(self):
        self.umbrella = Umbrella.objects.create(
            code='01',
            description='Test umbrella',
            sunbeds=2,
            row=1,
            column=1,
        )

    def test_umbrella_creation(self):
        self.assertTrue(isinstance(self.umbrella, Umbrella))
        self.assertEqual(self.umbrella.code, '01')
        self.assertEqual(self.umbrella.description, 'Test umbrella')
        self.assertEqual(self.umbrella.sunbeds, 2)
        self.assertEqual(self.umbrella.row, 1)
        self.assertEqual(self.umbrella.column, 1)

    def test_default_values(self):
        umbrella_with_defaults = Umbrella.objects.create(
            code='02',
            description='Test umbrella with defaults',
            sunbeds=3,
        )
        self.assertEqual(umbrella_with_defaults.row, 0)
        self.assertEqual(umbrella_with_defaults.column, 0)

    def test_season_foreign_key(self):
        # Assuming Season model is properly defined
        season = Season.objects.create(season='2024', start_date='2024-06-01', end_date='2024-09-30', active=False)
        umbrella_with_season = Umbrella.objects.create(
            code='03',
            description='Test umbrella with season',
            sunbeds=4,
            season=season,
        )
        self.assertEqual(umbrella_with_season.season, season)