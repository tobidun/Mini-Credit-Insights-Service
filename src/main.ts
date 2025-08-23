import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  logger.log("Starting Credit Insights Service...");

  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error", "debug", "verbose"],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("Credit Insights Service API")
    .setDescription(
      "API for managing bank statements, insights, and credit bureau checks"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `🚀 Credit Insights Service is running on: http://localhost:${port}`
  );
  logger.log(
    `📚 API Documentation available at: http://localhost:${port}/api/v1/docs`
  );
  logger.log(
    `🏥 Health check available at: http://localhost:${port}/api/v1/health`
  );
  logger.log(
    `📊 Metrics available at: http://localhost:${port}/api/v1/health/metrics`
  );
}
bootstrap();
