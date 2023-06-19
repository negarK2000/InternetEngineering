import re
import json


state = 'success'

def setState(new):
    global state
    state = new

def getState():
    return state

class Student:
    students_list = {
        'negar':{
            'name' : 'negar', 'email' : 'negar@gmail.com', 'course' : 'IE', 'score' : 20
        }
    }

    def __init__(self, name='none', email='none', course='none', score=-1):
        self.newStudent = {}

        if name != 'none':
            self.name = name
            self.newStudent['name'] = name
        else:
            print("Invalid Name")
            setState('fail')

        regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

        if email != 'none' and re.search(regex, email):
            self.email = email
            self.newStudent['email'] = email
        else:
            print("Invalid Email")
            setState('fail')

        if course != 'none':
            self.course = course
            self.newStudent['course'] = course
        else:
            print("Invalid Course")
            setState('fail')

        try:
            s = int(score)
            if 0 <= s <= 20:
                self.score = s
                self.newStudent['score'] = str(s)
            else:
                print("Invalid Score")
                setState('fail')

        except ValueError:
            print("Invalid Score")
            setState('fail')

        Student.students_list[name] = self.newStudent
        print(Student.students_list)

    @staticmethod
    def store():
        with open('./files/students_file.json', 'w') as f:
            json.dump(Student.students_list, f)

    @staticmethod
    def restore():
        with open('./files/students_file.json', 'r') as f:
            data = json.load(f)

        Student.students_list = data
        print(Student.students_list)

    @staticmethod
    def get_student_info(id):
        if id in Student.students_list.keys():
            return Student.students_list[id]
        else:
            return {'state': 'fail', 'reason': 'Wrong Name'}

    @staticmethod
    def delete(id):
        if id in Student.students_list.keys():
            Student.students_list.pop(id)
        else:
            print("Invalid Name")
            setState('fail')

        print(Student.students_list)


class Course:
    courses_list = {
        'IE':{
            'name': 'IE',
            'prof': 'someone',
            'students': ['negar']
        }
    }

    def __init__(self, name='none', prof='none'):
        self.newCourse = {}

        self.name = name
        self.newCourse['name'] = name

        self.prof = prof
        self.newCourse['prof'] = prof

        self.newCourse['students'] = []
        Course.courses_list[name] = self.newCourse
        print(Course.courses_list)

    @staticmethod
    def store():
        with open('./files/courses_file.json', 'w') as f:
            json.dump(Course.courses_list, f)

    @staticmethod
    def restore():
        with open('./files/courses_file.json', 'r') as f:
            data = json.load(f)

        Course.courses_list = data
        print(Course.courses_list)

    @staticmethod
    def add_student_to_course(s_id, c_id):

        if c_id in Course.courses_list.keys() and s_id in Student.students_list.keys():
            Course.courses_list[c_id]['students'].append(s_id)
            Student.students_list[s_id]['course'] = c_id
        else:
            print("Invalid Name")
            setState('fail')

    @staticmethod
    def get_course_info(id):
        if id in Course.courses_list.keys():
            return Course.courses_list[id]
        else:
            return {'state': 'fail', 'reason': 'Wrong Name'}

    @staticmethod
    def delete(id):

        if id in Course.courses_list.keys():
            Course.courses_list.pop(id)
        else:
            print("Invalid Name")
            setState('fail')

        print(Course.courses_list)