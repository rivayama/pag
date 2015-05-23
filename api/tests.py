from django.test import TestCase
from django.core.urlresolvers import reverse

from pag import utils

class viewProjectsTest(TestCase):

    def test_question_api_with_get_access(self):
        response = self.client.get(reverse('api:projects'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')


    def test_question_api_with_post_access(self):
        response = self.client.post(reverse('api:projects'))
        self.assertEqual(response.status_code, 405) # method not allowed


    def test_grade_api_with_get_access(self):
        response = self.client.get(reverse('api:grade', args=(1,)))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')


    def test_grade_api_with_post_access(self):
        response = self.client.post(reverse('api:grade', args=(1,)))
        self.assertEqual(response.status_code, 405) # method not allowed

