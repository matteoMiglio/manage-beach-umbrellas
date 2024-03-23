from django.db import models

class Audit(models.Model):
    id = models.AutoField(primary_key=True)
    message = models.TextField(blank=True)
    EVENT_TYPE = (
        ('A', 'add'),
        ('D', 'delete'),
        ('U', 'update'),
    )
    type = models.CharField(max_length=1, choices=EVENT_TYPE, default="A")
    CATEGORY_TYPE = (
        ('R', 'reservation'),
        ('S', 'subscription'),
        ('C', 'constant'),
    )
    category = models.CharField(max_length=1, choices=CATEGORY_TYPE, default="R")
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.id