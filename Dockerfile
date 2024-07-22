FROM node:lts-bullseye

ENV HOST='0.0.0.0'
ENV PORT='3000'
ENV NUXT_PUBLIC_SITE_URL = 'https://app.omnip.eu'
ENV NUXT_PUBLIC_DIRECTUS_URL=https://regie.omnip.eu
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_ANCESTORS=array:http://localhost:*,https://localhost:*,self
ENV NUXT_PUBLIC_FIREBASE_PROJECT_ID=corailfactory
ENV NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=corailfactory.firebaseapp.com
ENV NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=corailfactory.appspot.com


WORKDIR /webapp
#RUN node - add --global pnpm
RUN npm install -g pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --shamefully-hoist

# Bundle app source
COPY . .

RUN pnpm generate:capacitor

# Expose port 3000
EXPOSE 3000

CMD ["npx", "serve", "./.output/public"]