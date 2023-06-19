import argparse, sys
import requests
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError, DecodeError

server_addr = 'http://localhost:8080'
signature = 'My_Big_Fat_Secret'
functions = ['add', 'delete', 'create','getOne', 'getAll', 'sendEmail']


def get(token):
    response = requests.get(server_addr, headers={'Authorization': 'Bearer ' + token})

    print(response.status_code)
    print(response.headers)

    return response.headers


def encode(about, func, info):
    payload_data = {
        "about": about,
        "func": func
    }

    if func == functions[0]:
        payload_data['student_id'] = info[0]
        payload_data['course_id'] = info[1]

    elif func == functions[1] or func == functions[3] or func == functions[5]:
        payload_data['id'] = info[0]

    elif func == functions[2]:
        payload_data['name'] = info[0]

        if about == 'course':
            payload_data['prof'] = info[1]
        else:
            payload_data['email'] = info[1]
            payload_data['course'] = info[2]
            payload_data['score'] = info[3]

    print(payload_data)

    token = jwt.encode(
        payload=payload_data,
        key=signature
    )

    return token


def authentication(headers):
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
            return verify, payload

        except (ExpiredSignatureError, InvalidSignatureError, DecodeError) as error:
            print(f'Unable to decode the token , error: {error}')
            return verify, payload

    else:
        print('Error : {} Authorization'.format(headers['Authorization']))
        return verify, payload


def parse_args(argv=sys.argv[1:]):
    parser = argparse.ArgumentParser(description='Client-Server HTTP requests')

    parser.add_argument('--about', '-a', dest='about', type=str, default='student',
                        help='chose to request about student or course (default=student)')

    parser.add_argument('--function', '-f', dest='func', type=str, default='getAll',
                        help='chose what you want to request (options = add, delete, create, getOne, getAll) (default=getAll)')

    parser.add_argument('--info', '-i', dest='info', type=str, default=[], nargs='+',
                        help='information about the request')

    args = parser.parse_args(argv)
    return args


def main(argv=sys.argv[1:]):
    args = parse_args(argv)

    about = args.about
    func = args.func
    info = args.info

    token = encode(about, func, info)
    response = {}

    if func in functions:
        response = get(token)

    verify, payload = authentication(response)
    if not verify:
        return

    print(payload)

    print('Connection Ended.')

if __name__ == '__main__':
    main()