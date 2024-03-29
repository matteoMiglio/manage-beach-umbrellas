from ..models.season import Season
from ..models.reservation import Reservation
from ..models.umbrella import Umbrella
from django.test import TestCase

class ReservationModelTestCase(TestCase):
    def setUp(self):
        self.season = Season.objects.create(
            season='2024',
            start_date='2024-06-01',
            end_date='2024-09-30',
            active=True,
        )
        self.umbrella = Umbrella.objects.create(
            code='001',
            description='Test umbrella',
            sunbeds=2,
            row=1,
            column=1,
            season=self.season
        )

    def test_reservation_creation(self):
        reservation = Reservation.objects.create(
            code=1,
            umbrella=self.umbrella,
            customer='John Doe',
            date='2024-07-15',
            paid=True,
            price=50,
            season=self.season,
        )
        self.assertTrue(isinstance(reservation, Reservation))
        self.assertEqual(reservation.code, 1)
        self.assertEqual(reservation.umbrella, self.umbrella)
        self.assertEqual(reservation.customer, 'John Doe')
        self.assertEqual(reservation.date, '2024-07-15')
        self.assertTrue(reservation.paid)
        self.assertEqual(reservation.price, 50)
        self.assertEqual(reservation.season, self.season)

    def test_unique_together_constraint(self):
        reservation1 = Reservation.objects.create(
            code=2,
            umbrella=self.umbrella,
            customer='Alice',
            date='2024-08-01',
        )
        with self.assertRaises(Exception) as context:
            reservation2 = Reservation.objects.create(
                code=3,
                umbrella=self.umbrella,
                customer='Bob',
                date='2024-08-01',
            )
        self.assertTrue('UNIQUE constraint failed' in str(context.exception))

    def test_auto_increment_code(self):
        reservation1 = Reservation.objects.create(
            umbrella=self.umbrella,
            customer='Charlie',
            date='2024-08-02',
            paid=True,
            price=40,
            season=self.season,
        )
        reservation2 = Reservation.objects.create(
            umbrella=self.umbrella,
            customer='David',
            date='2024-08-03',
            paid=True,
            price=50,
            season=self.season,
        )

        self.assertEqual(reservation1.code, 1)
        self.assertEqual(reservation2.code, 2)

