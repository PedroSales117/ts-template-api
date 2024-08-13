import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

/**
 * Example entity to demonstrate how to define a TypeORM entity.
 * This entity is not meant to be used in the actual database schema but serves as a reference.
 * 
 * @example
 * // Example usage:
 * const product = new Product();
 * product.name = 'Sample Product';
 * product.description = 'This is a sample product.';
 * product.price = 19.99;
 * product.imageUrl = 'http://example.com/sample.jpg';
 * product.stock = 100;
 * await product.save();
 * 
 * // Note: This entity does not affect the database and is for demonstration purposes only.
 */
@Entity('example_products')
export class ExampleProduct extends BaseEntity {

    /**
     * The unique identifier for the product.
     * This column is automatically generated.
     * @type {number}
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * The name of the product.
     * @type {string}
     */
    @Column({ type: 'varchar' })
    name!: string;

    /**
     * A brief description of the product.
     * @type {string}
     */
    @Column({ type: 'text' })
    description!: string;

    /**
     * The price of the product.
     * This column is of type decimal with a precision of 10 and scale of 2.
     * @type {number}
     */
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    /**
     * The URL to the product's image.
     * @type {string}
     */
    @Column({ type: 'varchar' })
    imageUrl!: string;

    /**
     * The number of items in stock.
     * @type {number}
     */
    @Column({ type: 'int' })
    stock!: number;
}
