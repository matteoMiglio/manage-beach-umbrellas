from django.db import models

class Season(models.Model):
    # id = models.AutoField(primary_key=True)
    season = models.CharField(primary_key=True, max_length=4)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id