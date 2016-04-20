# coding: utf-8
import os
from fabric.api import run, env, cd, roles, lcd
from fabric.operations import local as lrun, run, sudo

env.roledefs = {
    'dev': ['dev@dev.trendever.com'],
    'production': ['production@dev.trendever.com'],
}
env.shell = "/bin/bash -l -i -c"

HOME = "~/"
PROJECT_PATH = HOME + "trendever_website/"
BACKEND_PATH = PROJECT_PATH + "backend/"
PROJECT_SRC = PROJECT_PATH + "backend/src/core/"

APP = PROJECT_PATH + "bin/core"


def git_pull():
    with cd(PROJECT_PATH):
        if "production" in env.roles:
            run("git pull origin master")
        else:
            run("git pull origin dev")
        print("Git pull: Success")


#
# def droptables():
#     with cd(BACKEND_PATH):
#         run("%s droptables" % APP)
#         print("droptables: Success")
#
#
# def migrate():
#     with cd(BACKEND_PATH):
#         run("%s migrate" % APP)
#         print("migrate: Success")
#
#
def build_backend():
    with cd(BACKEND_PATH):
        run("gb build all")
        print("Building: Success")


def install_req():
    with cd(PROJECT_PATH):
        run("npm install")
        print("Install requirements: Success")


def build():
    with cd(PROJECT_PATH):
        run("npm run build")
        print("Build static: Success")


def restart_backend():
    if "production" in env.roles:
        run("sudo supervisorctl restart production_webserver")
    else:
        run("sudo supervisorctl restart dev_webserver")
    print("Restart supervisor: Success")


def update_backend():
    git_pull()
    build_backend()
    restart_backend()


def update():
    git_pull()
    build()


def localhost():
    global run
    global sudo
    global lrun
    global lcd
    global cd
    run = sudo = lrun
    cd = lcd
    env.host = ['localhost']


def test():
    print(env.user)
    print(env.roles)
    print("test")
