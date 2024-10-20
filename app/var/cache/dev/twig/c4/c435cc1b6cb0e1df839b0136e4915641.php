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
    <h1 class=\"page-title\">Send</h1>
    <h2 class=\"section-title\">Bolt 11</h2>
    <div class=\"container\">
    ";
        // line 11
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 11, $this->source); })()), 'form_start');
        yield "
        <div class=\"form-group\">
            ";
        // line 13
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 13, $this->source); })()), "invoice", [], "any", false, false, false, 13), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 16
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 16, $this->source); })()), "submit", [], "any", false, false, false, 16), 'widget');
        yield "
        </div>
    ";
        // line 18
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form11"]) || array_key_exists("form11", $context) ? $context["form11"] : (function () { throw new RuntimeError('Variable "form11" does not exist.', 18, $this->source); })()), 'form_end');
        yield "

   </div>
    <h2 class=\"section-title\">Bolt 12</h2>
    <div class=\"container\">
    ";
        // line 23
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 23, $this->source); })()), 'form_start');
        yield "
        <div class=\"form-group\">
            ";
        // line 25
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 25, $this->source); })()), "amount", [], "any", false, false, false, 25), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 28
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 28, $this->source); })()), "message", [], "any", false, false, false, 28), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 31
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 31, $this->source); })()), "offer", [], "any", false, false, false, 31), 'widget');
        yield "
        </div>
        <div class=\"form-group\">
            ";
        // line 34
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 34, $this->source); })()), "submit", [], "any", false, false, false, 34), 'widget');
        yield "
        </div>
    ";
        // line 36
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form12"]) || array_key_exists("form12", $context) ? $context["form12"] : (function () { throw new RuntimeError('Variable "form12" does not exist.', 36, $this->source); })()), 'form_end');
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
        return array (  133 => 36,  128 => 34,  122 => 31,  116 => 28,  110 => 25,  105 => 23,  97 => 18,  92 => 16,  86 => 13,  81 => 11,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/payment/pay_invoice.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Send{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"page-title\">Send</h1>
    <h2 class=\"section-title\">Bolt 11</h2>
    <div class=\"container\">
    {{ form_start(form11) }}
        <div class=\"form-group\">
            {{ form_widget(form11.invoice) }}
        </div>
        <div class=\"form-group\">
            {{ form_widget(form11.submit) }}
        </div>
    {{ form_end(form11) }}

   </div>
    <h2 class=\"section-title\">Bolt 12</h2>
    <div class=\"container\">
    {{ form_start(form12) }}
        <div class=\"form-group\">
            {{ form_widget(form12.amount) }}
        </div>
        <div class=\"form-group\">
            {{ form_widget(form12.message) }}
        </div>
        <div class=\"form-group\">
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
