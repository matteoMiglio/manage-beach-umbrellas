from django.db import models

# Create your models here.

class Umbrella(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=3, blank=True)
    description = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField()
    row = models.SmallIntegerField(default=0)
    column = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code

class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.PositiveSmallIntegerField(default=1, unique=True)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField(default=2)
    SUBSCRIPTIONS_TYPE = (
        ('S', 'seasonal'),
        ('P', 'periodic'),
        ('C', 'custom'),
    )
    type = models.CharField(max_length=1, choices=SUBSCRIPTIONS_TYPE, default='S')
    custom_period = models.CharField(max_length=30, blank=True, null=True)
    deposit = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    total = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    paid = models.BooleanField()
    # freePeriodList:
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code
    
    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet
        if self._state.adding:
            # Get the maximum display_id value from the database
            last_id = Subscription.objects.all().aggregate(largest=models.Max('code')).get('largest')

            # aggregate can return None! Check it first.
            # If it isn't none, just use the last ID specified (which should be the greatest) and add one to it
            if last_id is not None:
                self.code = last_id + 1

        super(Subscription, self).save(*args, **kwargs)    

class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.IntegerField(null=True, blank=True)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField(default=2)
    date = models.DateField(blank=True)
    paid = models.BooleanField(null=True)
    price = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id

    class Meta:
        unique_together = ('umbrella', 'date',)

    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet

        if self._state.adding and not self._state.fields_cache.get('subscription'):
            last_id = Reservation.objects.all().aggregate(largest=models.Max('code')).get('largest')

            if last_id is not None:
                self.code = last_id + 1

        super(Reservation, self).save(*args, **kwargs)   

class Constant(models.Model):
    id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id
    
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
    