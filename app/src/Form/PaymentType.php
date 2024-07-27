<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PaymentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('type', ChoiceType::class, [
                'choices' => [
                    'BOLT 11' => 'bolt11',
                    'BOLT 12' => 'bolt12',
                ],
                'label' => 'Type de paiement',
            ])
            ->add('amount', TextType::class, [
                'label' => 'Montant (en satoshis)',
            ])
            ->add('description', TextType::class, [
                'label' => 'Description',
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Créer la facture',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([]);
    }
}
