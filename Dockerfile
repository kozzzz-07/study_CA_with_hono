FROM denoland/deno:2.4.4

WORKDIR /app

COPY . .

RUN deno cache src/main.ts

CMD ["deno", "run", "-A", "src/main.ts"]
