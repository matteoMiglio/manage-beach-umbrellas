from django.db import models
from .season import Season

class Umbrella(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=3, blank=True)
    description = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField()
    row = models.SmallIntegerField(default=0)
    column = models.SmallIntegerField(default=0)
    # season = models.ForeignKey(season.Season, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code