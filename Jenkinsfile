pipeline {
  agent {
    docker {
      image '929505712048.dkr.ecr.eu-west-1.amazonaws.com/seneca/services-ci-node8:1.0.1'
      args '--ulimit nofile=30000:30000'
    }
  }

  stages {
    stage('Build') {
      steps {
        slackSend "started ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
        sh "npm config set registry ${env.NPM_REGISTRY}"
        sh "npm config set @seneca:registry ${env.NPM_REGISTRY}"
        sh "echo 'always-auth=true' >> ~/.npmrc"
        sh "echo '//${env.NPM_KEY_ID}/:_authToken=${env.NPM_TOKEN}' >> ~/.npmrc"
        sh 'yarn'
        sh 'yarn build'
      }
    }

    stage('Run tests against the cloud') {
      steps {
        script {
          def cleanName = env.BRANCH_NAME.replaceAll("[^A-Za-z0-9]", "");
          env.SANE_BRANCH_NAME = cleanName.take(20);
        }
        sh "yarn start:dependencies:cloud ${env.SANE_BRANCH_NAME} --before-stack tables"
        sh "STAGE=${env.SANE_BRANCH_NAME} yarn test:cloud"
      }

      post {
        always {
          sh "yarn stop:dependencies:cloud ${env.SANE_BRANCH_NAME}"
        }
      }
    }

    stage('Get Repo Url') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'tournaments-client-repo-creds', passwordVariable: 'sl_password', usernameVariable: 'sl_username')]) {
          script {
            def bareUrl = sh(returnStdout: true, script: 'git config --get remote.origin.url').trim()
            def url = new URL(bareUrl)
            env.GIT_REPO_URL = "${url.protocol}://${sl_username}:${sl_password}@${url.host}${url.file}"
          }
        }
      }
    }

    stage('Merge dev -> master') {
      when {
        branch 'dev'
      }
      steps {
        sh('#!/bin/sh -e\n' + "git config remote.origin.url ${env.GIT_REPO_URL}")
        sh 'git config --global user.email "jenkins-mccloud@senecalearning.com"'
        sh 'git config --global user.name "Jenkins McCloud"'
        sh "git fetch origin master:master"
        sh 'git checkout -f master'
        sh 'git merge --no-ff origin/dev'
        sh "git push origin master"
      }
    }

    stage('Release!') {
      when {
        branch 'master'
      }
      steps {
        script {
          env.VERSION = sh(returnStdout: true, script: 'node -e "console.log(require(\'./package.json\').version)"').trim()
        }

        sh "git tag V${env.VERSION}"
        sh "git push ${env.GIT_REPO_URL} V${env.VERSION}"
        sh "npm publish"
        slackSend message: "New tournaments-service-client V${env.VERSION} released 🙊 <https://github.com/lfeddern/tournamentsServiceClient/tree/master/docs|Documentation here>", color: "good"
      }
    }

    stage('Success') {
      steps {
        slackSend message: "Success! 🎉 ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", color: "good"
      }
    }
  }

  post {
    failure {
      slackSend message: "Failure! 🙈 ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", color: "danger"
    }
  }
}