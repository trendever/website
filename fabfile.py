# coding: utf-8
import os
from fabric.api import run, env, cd, roles, lcd
from fabric.operations import local as lrun, run, sudo

env.roledefs = {
    'dev': ['dev@dev.trendever.com'],
    'live': ['live@trendever.com'],
}
env.shell = "/bin/bash -l -i -c"
env.forward_agent = True

HOME = "~/"
PROJECT_PATH = HOME + "trendever_website/"


def git_pull():
    with cd(PROJECT_PATH):
        if "live" in env.roles:
            run("git pull origin master")
        else:
            run("git pull origin dev")
        print("Git pull: Success")


def install_req():
    with cd(PROJECT_PATH):
        run("npm install")
        print("Install requirements: Success")


def build():
    with cd(PROJECT_PATH):
        run("npm run build")
        print("Build static: Success")

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
