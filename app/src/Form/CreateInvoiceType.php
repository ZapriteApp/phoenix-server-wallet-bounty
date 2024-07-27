<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CreateInvoiceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('amount', TextType::class, [
                'attr' => [
                  'class' => 'form-control',
                  'placeholder' => 'Amount (satoshis)'
                ],
            ])
            ->add('description', TextType::class, [
                'attr' => [
                  'class' => 'form-control',
                  'placeholder' => 'Description'
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Generate',
                'attr' => ['class' => 'btn btn-primary mt-3'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([]);
    }
}
