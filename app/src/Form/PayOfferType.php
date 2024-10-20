<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class PayOfferType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
      $builder
      ->add('amount', TextType::class, [
          'attr' => [
            'class' => 'form-control',
            'placeholder' => 'Amount (satoshis)'
          ],
      ])
      ->add('offer', TextType::class, [
          'attr' => [
            'class' => 'form-control',
            'placeholder' => 'Offer Bolt12'
          ],
      ])
      ->add('message', TextType::class, [
          'attr' => [
            'class' => 'form-control',
            'placeholder' => 'Message'
          ],
      ])
      ->add('submit', SubmitType::class, [
          'label' => 'Pay',
          'attr' => ['class' => 'btn btn-primary mt-3'],
      ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
