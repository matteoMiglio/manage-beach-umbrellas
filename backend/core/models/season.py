from django.db import models

class Season(models.Model):
    season = models.CharField(primary_key=True, max_length=4)
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id
    
    def save(self, *args, **kwargs):
        if self.active:
            # Disattiva tutte le altre stagioni attive
            Season.objects.filter(active=True).update(active=False)
        super(Season, self).save(*args, **kwargs)