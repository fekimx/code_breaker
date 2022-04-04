from django.test import LiveServerTestCase, TestCase
from selenium import webdriver
from os import getcwd

class Hosttest(LiveServerTestCase):
    
    def testhomepage(self):
        driver = webdriver.Chrome(desired_capabilities={"page_load_strategy": "none"})
        driver.get('http://127.0.0.1:8000/Homepage')
        assert "Code Breaker" in driver.title