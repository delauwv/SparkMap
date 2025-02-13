# Gestion des headers
class HeaderHandler(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            headers.append(('Access-Control-Allow-Origin', '*'))
            headers.append(('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'))
            headers.append(('Access-Control-Allow-Headers', 'Content-Type, SOAPAction'))
            return start_response(status, headers, exc_info)

        if environ['REQUEST_METHOD'] == 'OPTIONS':
            custom_start_response('200 OK', [])
            return [b'']
        return self.app(environ, custom_start_response)