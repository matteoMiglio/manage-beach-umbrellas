from ..models.season import Season
from ..models.umbrella import Umbrella
from ..models.subscription import Subscription
from django.test import TestCase

class SubscriptionModelTestCase(TestCase):
    def setUp(self):
        self.season = Season.objects.create(
            season='2024',
            start_date='2024-06-01',
            end_date='2024-08-31',
            active=True,
        )
        self.season2 = Season.objects.create(
            season='2023',
            start_date='2023-06-01',
            end_date='2023-08-31',
            active=False,
        )
        self.umbrella = Umbrella.objects.create(
            code='01',
            description='Test umbrella',
            sunbeds=2,
            row=1,
            column=1,
            season=self.season
        )
        self.umbrella2 = Umbrella.objects.create(
            code='02',
            description='Test umbrella',
            sunbeds=2,
            row=1,
            column=1,
            season=self.season
        )

    def test_subscription_creation(self):
        subscription = Subscription.objects.create(
            code=1,
            umbrella=self.umbrella,
            customer='John Doe',
            sunbeds=2,
            type='P',
            paid=True,
            start_date='2024-06-15',
            end_date='2024-07-15',
            season=self.season,
        )
        self.assertTrue(isinstance(subscription, Subscription))
        self.assertEqual(subscription.code, 1)
        self.assertEqual(subscription.umbrella, self.umbrella)
        self.assertEqual(subscription.customer, 'John Doe')
        self.assertEqual(subscription.sunbeds, 2)
        self.assertEqual(subscription.type, 'P')
        self.assertTrue(subscription.paid)
        self.assertEqual(subscription.start_date, '2024-06-15')
        self.assertEqual(subscription.end_date, '2024-07-15')
        self.assertEqual(subscription.season, self.season)

    # def test_unique_constraint_within_season(self):
    #     subscription1 = Subscription.objects.create(
    #         code=2,
    #         umbrella=self.umbrella,
    #         customer='Jane Smith',
    #         sunbeds=2,
    #         type='S',
    #         paid=True,
    #         start_date=self.season.start_date,
    #         end_date=self.season.end_date,
    #         season=self.season,
    #     )
    #     with self.assertRaises(Exception) as context:
    #         subscription2 = Subscription.objects.create(
    #             code=2,  # Duplicating code
    #             umbrella=self.umbrella2,
    #             customer='Bob',
    #             sunbeds=2,
    #             type='S',
    #             paid=True,
    #             start_date=self.season2.start_date,
    #             end_date=self.season2.end_date,
    #             season=self.season2,
    #         )
    #     self.assertTrue('UNIQUE constraint failed' in str(context.exception))

    def test_auto_increment_code_within_season(self):
        subscription1 = Subscription.objects.create(
            umbrella=self.umbrella,
            customer='Alice',
            sunbeds=2,
            type='S',
            paid=True,
            start_date=self.season.start_date,
            end_date=self.season.end_date,
            season=self.season,
        )
        subscription2 = Subscription.objects.create(
            umbrella=self.umbrella2,
            customer='David',
            sunbeds=2,
            type='S',
            paid=True,
            start_date=self.season.start_date,
            end_date=self.season.end_date,
            season=self.season,
        )
        self.assertEqual(subscription1.code, 1)
        self.assertEqual(subscription2.code, 2)
