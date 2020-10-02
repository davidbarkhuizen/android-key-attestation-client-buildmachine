FROM ubuntu:20.04  
LABEL maintainer "david.barkhuizen@gmail"

WORKDIR /

SHELL ["/bin/bash", "-c"]

ARG GRADLE_VERSION=5.4.1
ARG ANDROID_API_LEVEL=30
ARG ANDROID_BUILD_TOOLS_LEVEL=30.0.2

# if this is not set, then the apt install of tzinfo hangs (waits for stdin)
#
ENV TZ=Africa/Johannesburg
ENV DEBIAN_FRONTEND=noninteractive

# apt packages
RUN apt update 
RUN apt install -y openjdk-8-jdk vim git unzip libglu1 libpulse-dev libasound2 libc6  libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxi6  libxtst6 libnss3 wget

RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp 
RUN unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip 
RUN rm /tmp/gradle-${GRADLE_VERSION}-bin.zip

RUN mkdir /opt/gradlew
RUN /opt/gradle/gradle-${GRADLE_VERSION}/bin/gradle wrapper --gradle-version ${GRADLE_VERSION} --distribution-type all -p /opt/gradlew
RUN /opt/gradle/gradle-${GRADLE_VERSION}/bin/gradle wrapper -p /opt/gradlew

RUN wget 'https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip' -P /tmp
RUN mkdir /opt/android/
RUN mkdir /opt/android/cmdline-tools
RUN unzip -d /opt/android/cmdline-tools /tmp/commandlinetools-linux-6609375_latest.zip
RUN rm /tmp/commandlinetools-linux-6609375_latest.zip

RUN yes Y | /opt/android/cmdline-tools/tools/bin/sdkmanager --install "platform-tools" 
RUN yes Y | /opt/android/cmdline-tools/tools/bin/sdkmanager --install "build-tools;${ANDROID_BUILD_TOOLS_LEVEL}"

RUN yes Y | /opt/android/tools/bin/sdkmanager --licenses

ENV GRADLE_HOME=/opt/gradle/gradle-$GRADLE_VERSION
ENV ANDROID_HOME=/opt/android
ENV PATH "$PATH:$GRADLE_HOME/bin:/opt/gradlew:$ANDROID_HOME/emulator:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools"
ENV ANDROID_SDK_ROOT=/opt/android

# force gradle to D/L gradle components
#RUN /tmp/build-machine/indrajala-fluid-client/studio/gradlew

# force gradle to D/L dependencies & configure
#RUN /tmp/build-machine/indrajala-fluid-client/studio/gradlew build

# --------------------------------------------------------------------------
# NODEJS

RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN npm install -y n -g
RUN n stable
RUN PATH="$PATH"

RUN npm install -g nodemon