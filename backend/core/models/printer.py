from django.db import models

class Printer(models.Model):
    id = models.AutoField(primary_key=True)
    ip_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code