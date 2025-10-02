from django.db import models
from category.models import Category

# Create your models here.
class Motopart(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('out_of_stock', 'Out of Stock'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    price = models.FloatField()
    discount = models.FloatField(default=0.0)
    stock = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='motoparts')
    manufacture_year = models.IntegerField()
    supplier = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    @property
    def discounted_price(self):
        """Calculate the price after discount"""
        if self.discount > 0:
            return self.price - (self.price * self.discount / 100)
        return self.price
    
    @property
    def is_available(self):
        """Check if motopart is available for purchase"""
        return self.status == 'active' and self.stock > 0
