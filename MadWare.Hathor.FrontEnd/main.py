import webapp2
import jinja2
import os

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainPageController(webapp2.RequestHandler):

    def get(self, url):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render({}))

app = webapp2.WSGIApplication([
    (r"/(.*)", MainPageController)
], debug=True)
