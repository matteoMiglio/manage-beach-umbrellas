from django.db import models

class Constant(models.Model):
    id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id