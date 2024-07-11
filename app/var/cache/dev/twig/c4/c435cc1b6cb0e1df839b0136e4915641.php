<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* payment/pay_invoice.html.twig */
class __TwigTemplate_6f4a42215266a7961817c6ba263ca9b2 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'body' => [$this, 'block_body'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 2
        return "base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "payment/pay_invoice.html.twig"));

        $this->parent = $this->loadTemplate("base.html.twig", "payment/pay_invoice.html.twig", 2);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Send";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 6
    public function block_body($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "body"));

        // line 7
        yield "<div class=\"home-container\">
    <h1 class=\"main-title\">Send</h1>
    <h2 class=\"balance-title\">Bolt 11</h2>
    <div class=\"container mt-5\">
    <h1 class=\"mb-4\">Payment Form</h1>
    ";
        // line 12
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 12, $this->source); })()), 'form_start');
        yield "
        <div class=\"form-group\">
            ";
        // line 14
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 14, $this->source); })()), "invoice", [], "any", false, false, false, 14), 'label');
        yield "
            ";
        // line 15
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 15, $this->source); })()), "invoice", [], "any", false, false, false, 15), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 18
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 18, $this->source); })()), "submit", [], "any", false, false, false, 18), 'widget');
        yield "
        </div>
    ";
        // line 20
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 20, $this->source); })()), 'form_end');
        yield "
    
   </div>
    <h2 class=\"balance-title\">Bolt 12</h2>
    <div class=\"container mt-5\">
    <h1 class=\"mb-4\">Payment Form</h1>
    ";
        // line 26
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 26, $this->source); })()), 'form_start');
        yield "
        <div class=\"form-group\">
            ";
        // line 28
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 28, $this->source); })()), "amount", [], "any", false, false, false, 28), 'label');
        yield "
            ";
        // line 29
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 29, $this->source); })()), "amount", [], "any", false, false, false, 29), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 32
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 32, $this->source); })()), "message", [], "any", false, false, false, 32), 'label');
        yield "
            ";
        // line 33
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 33, $this->source); })()), "message", [], "any", false, false, false, 33), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 36
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 36, $this->source); })()), "offer", [], "any", false, false, false, 36), 'label');
        yield "
            ";
        // line 37
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 37, $this->source); })()), "offer", [], "any", false, false, false, 37), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 40
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 40, $this->source); })()), "submit", [], "any", false, false, false, 40), 'widget');
        yield "
        </div>
    ";
        // line 42
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 42, $this->source); })()), 'form_end');
        yield "
    
   </div>
</div>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "payment/pay_invoice.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  151 => 42,  146 => 40,  140 => 37,  136 => 36,  130 => 33,  126 => 32,  120 => 29,  116 => 28,  111 => 26,  102 => 20,  97 => 18,  91 => 15,  87 => 14,  82 => 12,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/payment/pay_invoice.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Send{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"main-title\">Send</h1>
    <h2 class=\"balance-title\">Bolt 11</h2>
    <div class=\"container mt-5\">
    <h1 class=\"mb-4\">Payment Form</h1>
    {{ form_start(form11) }}
        <div class=\"form-group\">
            {{ form_label(form11.invoice) }}
            {{ form_widget(form11.invoice) }}
        </div>
        <div class=\"form-group\">
            {{ form_widget(form11.submit) }}
        </div>
    {{ form_end(form11) }}
    
   </div>
    <h2 class=\"balance-title\">Bolt 12</h2>
    <div class=\"container mt-5\">
    <h1 class=\"mb-4\">Payment Form</h1>
    {{ form_start(form12) }}
        <div class=\"form-group\">
            {{ form_label(form12.amount) }}
            {{ form_widget(form12.amount) }}
        </div>
        <div class=\"form-group\">
            {{ form_label(form12.message) }}
            {{ form_widget(form12.message) }}
        </div>
        <div class=\"form-group\">
            {{ form_label(form12.offer) }}
            {{ form_widget(form12.offer) }}
        </div>
        <div class=\"form-group\">
            {{ form_widget(form12.submit) }}
        </div>
    {{ form_end(form12) }}
    
   </div>
</div>
{% endblock %}

", "payment/pay_invoice.html.twig", "/var/www/symfony_docker/templates/payment/pay_invoice.html.twig");
    }
}
