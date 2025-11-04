import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacModule } from './modules/rbac/rbac.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { getDatabaseConfig } from './config/database.config';
import { EventsGateway } from './common/gateways/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    RbacModule,
    WorkflowModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
