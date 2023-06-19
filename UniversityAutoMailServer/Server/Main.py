from Classes import *
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError, DecodeError
from urllib3.exceptions import InsecureRequestWarning
import urllib3
urllib3.disable_warnings(InsecureRequestWarning)
import smtplib

signature = 'My_Big_Fat_Secret'
gmail_user = ''
gmail_password = ''

class HTTPRequestHandler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'

    def do_GET(self, body=True):
        print('************newRequest************')
        try:
            # request
            request_header = self.parse_headers()
            verify, payload = self.authentication(request_header)
            print(request_header)
            print(payload)

            if not verify:
                self.send_error(code=403, message=' You Can''t access the Server! Authentication Failed')
                return

            # response
            response = self.handle_request(payload)
            print(response)

            token = self.encode_payload(response)

            if getState() == 'success':
                self.send_response(200)
            else:
                self.send_response(400)

            self.send_header('Content-type', 'text')
            self.send_header('Authorization', 'Bearer ' + token)
            self.end_headers()

            if body:
                self.wfile.write(token.encode(encoding='UTF-8', errors='strict'))

            return

        finally:
            setState('success')

    def handle_request(self, req):
        if req['func'] == 'getAll':
            if req['about'] == 'student':
                return Student.students_list
            else:
                return Course.courses_list

        elif req['func'] == 'getOne':
            if req['about'] == 'student':
                return Student.get_student_info(req['id'])
            else:
                return Course.get_course_info(req['id'])

        elif req['func'] == 'delete':
            if req['about'] == 'student':
                Student.delete(req['id'])
            else:
                Course.delete(req['id'])

        elif req['func'] == 'add':
            Course.add_student_to_course(req['student_id'], req['course_id'])

        elif req['func'] == 'create':
            if req['about'] == 'student':
                Student(req['name'], req['email'], req['course'], req['score'])
            else:
                Course(req['name'], req['prof'])

        elif req['func'] == 'sendEmail':
            self.send_email(req['id'])

        return {'state': getState()}

    def send_email(self, id):
        course = Course.get_course_info(id)
        emails = {}
        bodies = {}
        print(course)

        for std in course['students']:
            info = Student.get_student_info(std)
            emails[info['email']] = {
                'name': std,
                'course': id,
                'professor': course['prof'],
                'score': info['score']
            }

            bodies[info['email']] = std + ' you have gained ' + str(info['score']) + ' in ' + id + ' course with ' + course['prof'] + ' Professor.'

        sent_from = gmail_user
        to = []
        for email in emails.keys():
            to.append(email)

        subject = 'Scores'

        for email in emails.keys():
            body = bodies[email]

            email_text = """\
                    From: %s
                    To: %s
                    Subject: %s

                    %s
                    """ % (sent_from, ", ".join(to), subject, body)

            try:
                smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
                smtp_server.ehlo()
                smtp_server.login(gmail_user, gmail_password)
                smtp_server.sendmail(sent_from, to, email_text)
                smtp_server.close()
                print("Email sent successfully!")
            except Exception as ex:
                setState('fail')
                print("Something went wrong….", ex)

        return emails

    def authentication(self, headers):
        verify = False
        payload = {}

        if 'Authorization' not in headers.keys():
            return verify, payload

        auth_header = headers['Authorization'].split(' ')

        if auth_header[0] == 'Bearer':
            # checking expire time
            # verifying signature
            token = auth_header[1]
            try:
                header_data = jwt.get_unverified_header(token)

                payload = jwt.decode(token, key=signature, algorithms=[header_data['alg'], ])
                verify = True

                # if payload['name'] == 'Negar':
                #     verify = True
                # else:
                #     self.send_error(code=403, message='you don''t have Authorization to Access this Server')

                return verify, payload

            except (ExpiredSignatureError, InvalidSignatureError, DecodeError) as error:
                print(f'Unable to decode the token , error: {error}')
                return verify, payload

        else:
            print('Error : {} Authorization'.format(headers['Authorization']))
            return verify, payload

    def parse_headers(self):
        request_headers = {}

        header_lines = [h.strip() for h in str(self.headers).split('\n')]
        for line in header_lines:
            line_parts = line.split(':')

            if len(line_parts) == 2:
                request_headers[line_parts[0].strip()] = line_parts[1].strip()

        return request_headers

    def encode_payload(self, msg):
        token = jwt.encode(
            payload=msg,
            key=signature
        )
        return token


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


def main():
    Student.students_list['negar']['course'] = 'PO'
    print(Student.students_list['negar']['course'])

    server_address = ('127.0.0.1', 8080)
    httpd = ThreadedHTTPServer(server_address, HTTPRequestHandler)
    print('HTTP server is Running...')
    httpd.serve_forever()


if __name__ == '__main__':
    main()