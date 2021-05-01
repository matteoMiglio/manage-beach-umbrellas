from django.db import models

# Create your models here.

class Umbrella(models.Model):
    code = models.CharField(max_length=120)
    description = models.TextField()
    pos_x = models.CharField(max_length=3)
    pos_y = models.CharField(max_length=3)
    state = models.BooleanField(default=False)

    def _str_(self):
        return self.code
