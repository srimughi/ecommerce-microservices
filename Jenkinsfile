pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checkout completed'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def services = [
                        'user-service',
                        'product-service',
                        'order-service'
                    ]

                    for (service in services) {
                        dir(service) {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    def services = [
                        'user-service',
                        'product-service',
                        'order-service'
                    ]

                    for (service in services) {
                        dir(service) {
                            sh 'npm test -- --runInBand'
                        }
                    }
                }
            }
        }

        stage('Build Microservices') {
            steps {
                script {
                    def services = [
                        'user-service',
                        'product-service',
                        'order-service'
                    ]

                    for (service in services) {
                        dir(service) {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t ecommerce-user-service:${IMAGE_TAG} \
                        -t ecommerce-user-service:latest ./user-service

                    docker build -t ecommerce-product-service:${IMAGE_TAG} \
                        -t ecommerce-product-service:latest ./product-service

                    docker build -t ecommerce-order-service:${IMAGE_TAG} \
                        -t ecommerce-order-service:latest ./order-service
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: All microservices built and Docker images created.'
        }

        failure {
            echo 'FAILED: Please check the Jenkins console output.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
