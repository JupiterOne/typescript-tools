#!groovy

pipeline {
  agent none

  options {
    ansiColor('xterm')
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {
    stage('Build Setup') {
      parallel {
        stage('Build') {
          agent { label 'ecs-builder-node12' }
          steps {
            initBuild()

            sh 'yarn install'
            sh 'yarn lint'

            securityScan()

            script {
              if (env.BRANCH_NAME == 'master') {
                sh 'npx jupiterone-publish-npm-package --public --directory .'
              }
            }
          }
        }
      }
    }
  }
}
