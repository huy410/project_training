import { userInfo } from 'os';
import { Tracing } from 'trace_events';
import { BaseEntity, DeepPartial, Like, Repository } from 'typeorm';

export class TypeOrmRepository<T extends BaseEntity> {
  public repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }
  save(data: any): Promise<T> {
    return this.repository.save(data);
  }

  update(id: string | number | string[] | Date | number[] | Date[], data: any): Promise<any> {
    return this.repository.update(id, data);
  }
  delete(data: any): Promise<any> {
    return this.repository.delete(data);
  }
  
  async findOneByCondition(conditions: any): Promise<T> {
    return this.repository.findOne(conditions);
  }
  async findByCondition(conditions: any): Promise<T[]> {
    return this.repository.find({where: {user: conditions}});
  }
  async searchOneOrderDetail(conditions: any): Promise<T> {
      return this.repository.findOne({where: {product: conditions.product,order: conditions.order}}); 
  }
  
  public async getAll(): Promise<any> {
    return this.repository.find({
    })
  }

  public async getAllPageUser(perPage, pageNumber): Promise<any> {
    
    return this.repository.find({
      take: perPage,
      skip: (pageNumber-1)*perPage,      
    })
  }
  public async getAllPage(perPage, pageNumber, sort): Promise<any> {
    const sortCondition: any = {
      price: sort,
    }
    return this.repository.find({
      order: sortCondition,
      take: perPage,
      skip: (pageNumber-1)*perPage, 
    })
  }
  async listSearch(conditions: any): Promise<T[]> {
     return this.repository.find({where: {name: Like(`%${conditions.name}%`)}}); 
    }

  async productSearch(name: string, brand: number, category: number): Promise<T[]> {
    if(!name  && brand  && category){ 
      return  this.repository.find({
        where: {
          brand: Like(`%${brand}%`),
          category: Like(`%${category}%`)
        }
      })
    }
    if(name && !brand && category){ 
      return this.repository.find({
        where: {
          name: Like(`%${name}%`),
          category: Like(`%${category}%`)
        }
      })
    }
    if(name && brand && !category ){ 
      return this.repository.find({
        where: {
          name: Like(`%${name}%`),
          brand: Like(`%${brand}%`),
        }
      })
    }
    if(name && brand && category ){ 
      return this.repository.find({
        where: {
          name: Like(`%${name}%`),
          brand: Like(`%${brand}%`),
          category: Like(`%${category}%`)
        }
       })
    }
    return this.repository.find({where: [
    {name: Like(`%${name}%`),},
    {brand: Like(`%${brand}%`),},
    {category: Like(`%${category}%`)}
  ]}); 
  }
   async productSearchByFlashsale(conditions: any): Promise<T[]> {
    return this.repository.find({where: {
      flashsaleDetail: Like(`%${conditions.flashsaleDetail}%`),
    }}); 
   }
   async getUserByEmail(email: string): Promise<T[]>{
    return await this.repository.find({where:{email: email}});
   }
   async getUserByCode(conditions: any): Promise<T>{
    return this.repository.findOne({where: {
      code: Like(`%${conditions.code}%`),
    }});
   }
   
   async searchOrderDetail(conditions: any): Promise<T[]> {
    return this.repository.find({ where: { order: Like(`%${conditions.order}%`) } });
  }
}
