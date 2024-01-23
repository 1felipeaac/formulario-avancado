import './styles/global.css';

import {useForm, useFieldArray} from 'react-hook-form';
import{useState} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'

const createUserFromSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório').transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')
  }),
  email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)})).min(2, 'Insira pelo menos 2 tecnologias')
})


/**
 * To-do
 * [x]validação / transformação
 * [x]field arrays
 * []upload de arquivos
 * []compositions pattern
 */

function App() {

  const [output, setOutput] = useState();
  const {
    register,
    handleSubmit, 
    formState: {errors},
    control
  } = useForm({resolver: zodResolver(createUserFromSchema)});

  const {fields, append, remove} = useFieldArray(
    {
      control,
      name: 'techs',
    }
  );

  //console.log(formState.errors);

  function createUser(data){
    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech(){
    append({title:'', knowledge: 0})
  }

  return (
    <main >
      <form
        onSubmit={handleSubmit(createUser)}
      >
        <div>
          <label htmlFor='name'>Nome</label>
          <input 
            type='text' 
            {...register('name')}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor='email'>E-mail</label>
          <input 
            type='email' 
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor='password'>Senha</label>
          <input 
            type='password' 
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>


        <div>
          <label htmlFor='' className='techs'>
            Tecnologias
            <button type='button' onClick={addNewTech}>Adicionar</button>
          </label>
          {fields.map((field, index) =>{
            return(
              <div key={field.id} className='fields'>
                <div>
                  <input 
                    type='text' 
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span>{errors.techs?.[index]?.title.message}</span>}
                </div>
                <div>
                  <input 
                    type='number' 
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span>{errors.techs?.[index]?.knowledge.message}</span>}

                </div>
              </div>
            )
          })}
          {errors.techs && <span>{errors.techs.message}</span>}

        </div>

        <button type='submit'>Salvar</button>

      </form>

      <pre>
        {output}
      </pre>
    </main>
  )
}

export default App
