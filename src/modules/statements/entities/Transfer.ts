import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../users/entities/User";
enum OperationType {
  TRANSFER = 'transfer',
}

@Entity("transfers")
class Transfer {
  @PrimaryColumn()
  id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column()
  sender_id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: OperationType })
  type?: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.type) {
      this.type = OperationType.TRANSFER;
    }
  }
}

export { Transfer };
