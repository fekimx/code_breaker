import json
from random import randint
import unittest
from django.test import LiveServerTestCase, TestCase
from selenium import webdriver
from os import getcwd
import time
from coding.models import Class

class Hosttest(unittest.TestCase):
    
    def setUp(self):
        self.driver = webdriver.Chrome(desired_capabilities={"page_load_strategy": "none"})

    # def testhomepage(self):
    #     driver = self.driver
    #     try: 
    #         driver.get('http://127.0.0.1:8000/Homepage')
    #         driver.maximize_window()
    #         assert "Code Breaker" in driver.title

    #     except Exception as ex:
    #         print(ex)

    def test_register(self):   
        driver = self.driver
        try: 
            driver.get('http://127.0.0.1:8000/Homepage')
            driver.maximize_window()
        except Exception as ex:
            print(ex)
        else:
            time.sleep(5)

            try:
                driver.find_element_by_link_text('Register').click()  
                self.assertEqual(driver.find_element_by_class_name('text-2xl').text, 'Register an account', 'Failed')
            except Exception as ex:
                print(ex)
            
            try:
                firstName = driver.find_element_by_xpath('//*[@id="app"]/div/div/div[2]/div/form/div[1]/input')
                firstName.send_keys("firstNameTest")

                time.sleep(1)
                lastName = driver.find_element_by_xpath('//*[@id="app"]/div/div/div[2]/div/form/div[2]/input')
                lastName.send_keys("lastNameTest")
                time.sleep(1)
                emailAddress = driver.find_element_by_xpath('//*[@id="email"]')
                emailAddress.send_keys("endtoend1@test.com")               
                time.sleep(1)
                userName = driver.find_element_by_xpath('//*[@id="username"]')
                userName.send_keys("userNameTest1")    
                time.sleep(1)
                passwd = driver.find_element_by_xpath('//*[@id="password"]')
                passwd.send_keys("passwdtest1")    
                time.sleep(1)
                #click i agree
                driver.find_element_by_xpath('//*[@id="app"]/div/div/div[2]/div/form/div[7]/div/label').click()
                time.sleep(1)
                #click register
                driver.find_element_by_xpath('//*[@id="app"]/div/div/div[2]/div/form/div[8]/button').click()
                time.sleep(4)

            except Exception as ex:
                print(ex)

            try:
                time.sleep(2)
                driver.find_element_by_link_text('Log In').click()
                self.assertEqual(driver.find_element_by_class_name('text-2xl').text, 'Log in to your account', 'Failed')
                
                loginEmailAddress = driver.find_element_by_xpath('//*[@id="email"]')
                loginEmailAddress.send_keys("endtoend1@test.com")               
                time.sleep(2)
                loginPasswd = driver.find_element_by_xpath('//*[@id="password"]')
                loginPasswd.send_keys("passwdtest1")   

                driver.find_element_by_xpath('//*[@id="app"]/div/div/div[2]/div/form/div[6]/button').click()

                
            except Exception as ex:
                print(ex)

            try:
                time.sleep(3)
                self.assertEqual(driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/div/div/div/div/form/label').text, 'Class Code :', 'Failed')
                addClass = driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/div/div/div/div/form/input')
                addClass.send_keys("002")   
                time.sleep(2)
                driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/div/div/div/div/form/button').click()
                time.sleep(3)
                self.assertEqual(driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/div/div/div/table/tbody/tr/td[2]').text, '002', 'Failed')

            except Exception as ex:
                print(ex)
                
            #print(driver.find_element_by_class_name('text-2xl').text)
            self.driver.quit()
            

    # def tearDown(self):
    #     self.driver.quit()

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
        
if __name__=="__main__":
    unittest.main()