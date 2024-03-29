from django.test import TestCase
from ..models.audit import Audit

class AuditModelTestCase(TestCase):
    def test_audit_creation(self):
        audit = Audit.objects.create(
            message='Test audit message',
            type='A',
            category='R',
        )
        self.assertTrue(isinstance(audit, Audit))
        self.assertEqual(audit.message, 'Test audit message')
        self.assertEqual(audit.type, 'A')
        self.assertEqual(audit.category, 'R')
