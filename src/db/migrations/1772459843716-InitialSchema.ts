import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1772459843716 implements MigrationInterface {
    name = 'InitialSchema1772459843716';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create User Table
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);

        // 2. Create Category Table
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);

        // 3. Create Product Table
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "description" character varying,
                "categoryId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);

        // 4. Add Foreign Key
        await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" 
            FOREIGN KEY ("categoryId") REFERENCES "category"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}