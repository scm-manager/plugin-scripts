#!groovy
pipeline {

  agent {
    docker {
      image 'node:14.15.1'
      label 'docker'
    }
  }

  environment {
    HOME = "${env.WORKSPACE}"
  }

  stages {

    stage('Set Version') {
      when {
        branch pattern: 'release/*', comparator: 'GLOB'
      }
      steps {
        // fetch all remotes from origin
        sh 'git config "remote.origin.fetch" "+refs/heads/*:refs/remotes/origin/*"'
        authGit 'SCM-Manager', 'fetch --all'

        // read version from brach, set it and commit it
        sh "git checkout ${env.BRANCH_NAME}"
        sh "git reset --hard origin/${env.BRANCH_NAME}"
        sh "git tag -d ${releaseVersion} || true"
        sh "yarn version --no-git-tag-version --new-version ${releaseVersion}"
        sh 'git add package.json'
        commit "release version ${releaseVersion}"

        // checkout, reset and merge
        sh 'git checkout main'
        sh 'git reset --hard origin/main'
        sh "git merge --ff-only ${env.BRANCH_NAME}"

        // set tag
        tag releaseVersion
      }
    }

    stage('Install') {
      steps {
        sh 'yarn install'
      }
    }

    stage('Check') {
      steps {
        sh 'yarn run check'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn run test-ci'
        junit 'junit.xml'
      }
    }

    stage('Deployment') {
      when {
        branch pattern: 'release/*', comparator: 'GLOB'
      }
      steps {
        withYarnAuth('npm-token-scm-manager') {
          sh "yarn publish --new-version ${releaseVersion}"
        }
      }
    }

    stage('Update Repository') {
      when {
        branch pattern: 'release/*', comparator: 'GLOB'
      }
      steps {
        // merge main in to develop
        sh 'git checkout develop'
        sh 'git merge main'

        // push changes back to remote repository
        authGit 'SCM-Manager', 'push origin --tags'
        authGit 'SCM-Manager', 'push origin main '
        authGit 'SCM-Manager', 'push origin develop'
        authGit 'SCM-Manager', "push -d origin ${env.BRANCH_NAME}"
      }
    }

  }

}

String getReleaseVersion() {
  return env.BRANCH_NAME.substring("release/".length());
}

void commit(String message) {
  authGit 'SCM-Manager', "-c user.name='CES Marvin' -c user.email='cesmarvin@cloudogu.com' commit -m '${message}'"
}

void tag(String version) {
  String message = "release version ${version}"
  authGit 'SCM-Manager', "-c user.name='CES Marvin' -c user.email='cesmarvin@cloudogu.com' tag -m '${message}' ${version}"
}

void withYarnAuth(String credentials, Closure<Void> closure) {
  withCredentials([string(credentialsId: credentials, variable: 'NPM_TOKEN')]) {
    writeFile encoding: 'UTF-8', file: '.npmrc', text: "//registry.npmjs.org/:_authToken='${NPM_TOKEN}'"
    writeFile encoding: 'UTF-8', file: '.yarnrc', text: '''
      registry "https://registry.npmjs.org/"
      always-auth true
      email cesmarvin@cloudogu.com
    '''.trim()

    closure.call()
  }
}

void authGit(String credentials, String command) {
  withCredentials([
    usernamePassword(credentialsId: credentials, usernameVariable: 'AUTH_USR', passwordVariable: 'AUTH_PSW')
  ]) {
    sh "git -c credential.helper=\"!f() { echo username='\$AUTH_USR'; echo password='\$AUTH_PSW'; }; f\" ${command}"
  }
}
