from django.test import LiveServerTestCase, TestCase
from selenium import webdriver
from os import getcwd
import json
from random import randint
from django.test import TestCase, Client
from django.db import models, router
from coding.models import Class

class Hosttest(LiveServerTestCase):
    
    def testhomepage(self):
        driver = webdriver.Chrome(desired_capabilities={"page_load_strategy": "none"})
        driver.get('http://127.0.0.1:8000/Homepage')
        assert "Code Breaker" in driver.title


# Unit tests
class ModelsTest(TestCase):
    def createClass(self, name, secretKey):
        return Class.objects.create(name=name, secretKey=secretKey)
    # silly test to make sure it is working!
    def test_class(self):
        class_obj = self.createClass(name='Class 1', secretKey=str(randint(10000,99999)))
        self.assertTrue(isinstance(class_obj, Class))

    def test_classCode(self):
        data = json.load(open('./seed/0006_Class.json'))
        self.assertIn("'secretKey': '001'", str(data))