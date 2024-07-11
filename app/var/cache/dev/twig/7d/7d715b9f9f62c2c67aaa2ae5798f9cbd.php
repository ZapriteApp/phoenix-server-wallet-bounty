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

/* bootstrap_4_layout.html.twig */
class __TwigTemplate_7385ebd48ac2e927ddbe5fecb51c364d extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        // line 1
        $_trait_0 = $this->loadTemplate("bootstrap_base_layout.html.twig", "bootstrap_4_layout.html.twig", 1);
        if (!$_trait_0->unwrap()->isTraitable()) {
            throw new RuntimeError('Template "'."bootstrap_base_layout.html.twig".'" cannot be used as a trait.', 1, $this->source);
        }
        $_trait_0_blocks = $_trait_0->unwrap()->getBlocks();

        $this->traits = $_trait_0_blocks;

        $this->blocks = array_merge(
            $this->traits,
            [
                'money_widget' => [$this, 'block_money_widget'],
                'datetime_widget' => [$this, 'block_datetime_widget'],
                'date_widget' => [$this, 'block_date_widget'],
                'time_widget' => [$this, 'block_time_widget'],
                'dateinterval_widget' => [$this, 'block_dateinterval_widget'],
                'percent_widget' => [$this, 'block_percent_widget'],
                'file_widget' => [$this, 'block_file_widget'],
                'form_widget_simple' => [$this, 'block_form_widget_simple'],
                'widget_attributes' => [$this, 'block_widget_attributes'],
                'button_widget' => [$this, 'block_button_widget'],
                'submit_widget' => [$this, 'block_submit_widget'],
                'checkbox_widget' => [$this, 'block_checkbox_widget'],
                'radio_widget' => [$this, 'block_radio_widget'],
                'choice_widget_collapsed' => [$this, 'block_choice_widget_collapsed'],
                'choice_widget_expanded' => [$this, 'block_choice_widget_expanded'],
                'form_label' => [$this, 'block_form_label'],
                'form_label_errors' => [$this, 'block_form_label_errors'],
                'checkbox_radio_label' => [$this, 'block_checkbox_radio_label'],
                'form_row' => [$this, 'block_form_row'],
                'form_errors' => [$this, 'block_form_errors'],
                'form_help' => [$this, 'block_form_help'],
            ]
        );
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "bootstrap_4_layout.html.twig"));

        // line 2
        yield "
";
        // line 4
        yield "
";
        // line 5
        yield from $this->unwrap()->yieldBlock('money_widget', $context, $blocks);
        // line 26
        yield "
";
        // line 27
        yield from $this->unwrap()->yieldBlock('datetime_widget', $context, $blocks);
        // line 34
        yield "
";
        // line 35
        yield from $this->unwrap()->yieldBlock('date_widget', $context, $blocks);
        // line 42
        yield "
";
        // line 43
        yield from $this->unwrap()->yieldBlock('time_widget', $context, $blocks);
        // line 50
        yield "
";
        // line 51
        yield from $this->unwrap()->yieldBlock('dateinterval_widget', $context, $blocks);
        // line 107
        yield "
";
        // line 108
        yield from $this->unwrap()->yieldBlock('percent_widget', $context, $blocks);
        // line 120
        yield "
";
        // line 121
        yield from $this->unwrap()->yieldBlock('file_widget', $context, $blocks);
        // line 136
        yield "
";
        // line 137
        yield from $this->unwrap()->yieldBlock('form_widget_simple', $context, $blocks);
        // line 153
        yield "
";
        // line 154
        yield from $this->unwrap()->yieldBlock('widget_attributes', $context, $blocks);
        // line 160
        yield "
";
        // line 161
        yield from $this->unwrap()->yieldBlock('button_widget', $context, $blocks);
        // line 165
        yield "
";
        // line 166
        yield from $this->unwrap()->yieldBlock('submit_widget', $context, $blocks);
        // line 170
        yield "
";
        // line 171
        yield from $this->unwrap()->yieldBlock('checkbox_widget', $context, $blocks);
        // line 190
        yield "
";
        // line 191
        yield from $this->unwrap()->yieldBlock('radio_widget', $context, $blocks);
        // line 205
        yield "
";
        // line 206
        yield from $this->unwrap()->yieldBlock('choice_widget_collapsed', $context, $blocks);
        // line 210
        yield "
";
        // line 211
        yield from $this->unwrap()->yieldBlock('choice_widget_expanded', $context, $blocks);
        // line 222
        yield "
";
        // line 224
        yield "
";
        // line 225
        yield from $this->unwrap()->yieldBlock('form_label', $context, $blocks);
        // line 247
        yield "
";
        // line 248
        yield from $this->unwrap()->yieldBlock('checkbox_radio_label', $context, $blocks);
        // line 278
        yield "
";
        // line 280
        yield "
";
        // line 281
        yield from $this->unwrap()->yieldBlock('form_row', $context, $blocks);
        // line 295
        yield "
";
        // line 297
        yield "
";
        // line 298
        yield from $this->unwrap()->yieldBlock('form_errors', $context, $blocks);
        // line 309
        yield "
";
        // line 311
        yield "
";
        // line 312
        yield from $this->unwrap()->yieldBlock('form_help', $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 5
    public function block_money_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "money_widget"));

        // line 6
        $context["prepend"] =  !(is_string($__internal_compile_0 = (isset($context["money_pattern"]) || array_key_exists("money_pattern", $context) ? $context["money_pattern"] : (function () { throw new RuntimeError('Variable "money_pattern" does not exist.', 6, $this->source); })())) && is_string($__internal_compile_1 = "{{") && str_starts_with($__internal_compile_0, $__internal_compile_1));
        // line 7
        $context["append"] =  !(is_string($__internal_compile_2 = (isset($context["money_pattern"]) || array_key_exists("money_pattern", $context) ? $context["money_pattern"] : (function () { throw new RuntimeError('Variable "money_pattern" does not exist.', 7, $this->source); })())) && is_string($__internal_compile_3 = "}}") && str_ends_with($__internal_compile_2, $__internal_compile_3));
        // line 8
        if (((isset($context["prepend"]) || array_key_exists("prepend", $context) ? $context["prepend"] : (function () { throw new RuntimeError('Variable "prepend" does not exist.', 8, $this->source); })()) || (isset($context["append"]) || array_key_exists("append", $context) ? $context["append"] : (function () { throw new RuntimeError('Variable "append" does not exist.', 8, $this->source); })()))) {
            // line 9
            yield "<div class=\"input-group ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("group_class", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["group_class"]) || array_key_exists("group_class", $context) ? $context["group_class"] : (function () { throw new RuntimeError('Variable "group_class" does not exist.', 9, $this->source); })()), "")) : ("")), "html", null, true);
            yield "\">";
            // line 10
            if ((isset($context["prepend"]) || array_key_exists("prepend", $context) ? $context["prepend"] : (function () { throw new RuntimeError('Variable "prepend" does not exist.', 10, $this->source); })())) {
                // line 11
                yield "<div class=\"input-group-prepend\">
                    <span class=\"input-group-text\">";
                // line 12
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->encodeCurrency($this->env, (isset($context["money_pattern"]) || array_key_exists("money_pattern", $context) ? $context["money_pattern"] : (function () { throw new RuntimeError('Variable "money_pattern" does not exist.', 12, $this->source); })()));
                yield "</span>
                </div>";
            }
            // line 15
            yield from             $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
            // line 16
            if ((isset($context["append"]) || array_key_exists("append", $context) ? $context["append"] : (function () { throw new RuntimeError('Variable "append" does not exist.', 16, $this->source); })())) {
                // line 17
                yield "<div class=\"input-group-append\">
                    <span class=\"input-group-text\">";
                // line 18
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->encodeCurrency($this->env, (isset($context["money_pattern"]) || array_key_exists("money_pattern", $context) ? $context["money_pattern"] : (function () { throw new RuntimeError('Variable "money_pattern" does not exist.', 18, $this->source); })()));
                yield "</span>
                </div>";
            }
            // line 21
            yield "</div>";
        } else {
            // line 23
            yield from             $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 27
    public function block_datetime_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "datetime_widget"));

        // line 28
        if ((((isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 28, $this->source); })()) != "single_text") &&  !(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 28, $this->source); })()))) {
            // line 29
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 29, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 29)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 29), "")) : ("")) . " form-control is-invalid"))]);
            // line 30
            $context["valid"] = true;
        }
        // line 32
        yield from $this->yieldParentBlock("datetime_widget", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 35
    public function block_date_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "date_widget"));

        // line 36
        if ((((isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 36, $this->source); })()) != "single_text") &&  !(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 36, $this->source); })()))) {
            // line 37
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 37, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 37)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 37), "")) : ("")) . " form-control is-invalid"))]);
            // line 38
            $context["valid"] = true;
        }
        // line 40
        yield from $this->yieldParentBlock("date_widget", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 43
    public function block_time_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "time_widget"));

        // line 44
        if ((((isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 44, $this->source); })()) != "single_text") &&  !(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 44, $this->source); })()))) {
            // line 45
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 45, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 45)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 45), "")) : ("")) . " form-control is-invalid"))]);
            // line 46
            $context["valid"] = true;
        }
        // line 48
        yield from $this->yieldParentBlock("time_widget", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 51
    public function block_dateinterval_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "dateinterval_widget"));

        // line 52
        if ((((isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 52, $this->source); })()) != "single_text") &&  !(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 52, $this->source); })()))) {
            // line 53
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 53, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 53)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 53), "")) : ("")) . " form-control is-invalid"))]);
            // line 54
            $context["valid"] = true;
        }
        // line 56
        if (((isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 56, $this->source); })()) == "single_text")) {
            // line 57
            yield from             $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
        } else {
            // line 59
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 59, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 59)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 59), "")) : ("")) . " form-inline"))]);
            // line 60
            yield "<div ";
            yield from             $this->unwrap()->yieldBlock("widget_container_attributes", $context, $blocks);
            yield ">";
            // line 61
            if ((isset($context["with_years"]) || array_key_exists("with_years", $context) ? $context["with_years"] : (function () { throw new RuntimeError('Variable "with_years" does not exist.', 61, $this->source); })())) {
                // line 62
                yield "<div class=\"col-auto\">
                ";
                // line 63
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 63, $this->source); })()), "years", [], "any", false, false, false, 63), 'label');
                yield "
                ";
                // line 64
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 64, $this->source); })()), "years", [], "any", false, false, false, 64), 'widget');
                yield "
            </div>";
            }
            // line 67
            if ((isset($context["with_months"]) || array_key_exists("with_months", $context) ? $context["with_months"] : (function () { throw new RuntimeError('Variable "with_months" does not exist.', 67, $this->source); })())) {
                // line 68
                yield "<div class=\"col-auto\">
                ";
                // line 69
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 69, $this->source); })()), "months", [], "any", false, false, false, 69), 'label');
                yield "
                ";
                // line 70
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 70, $this->source); })()), "months", [], "any", false, false, false, 70), 'widget');
                yield "
            </div>";
            }
            // line 73
            if ((isset($context["with_weeks"]) || array_key_exists("with_weeks", $context) ? $context["with_weeks"] : (function () { throw new RuntimeError('Variable "with_weeks" does not exist.', 73, $this->source); })())) {
                // line 74
                yield "<div class=\"col-auto\">
                ";
                // line 75
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 75, $this->source); })()), "weeks", [], "any", false, false, false, 75), 'label');
                yield "
                ";
                // line 76
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 76, $this->source); })()), "weeks", [], "any", false, false, false, 76), 'widget');
                yield "
            </div>";
            }
            // line 79
            if ((isset($context["with_days"]) || array_key_exists("with_days", $context) ? $context["with_days"] : (function () { throw new RuntimeError('Variable "with_days" does not exist.', 79, $this->source); })())) {
                // line 80
                yield "<div class=\"col-auto\">
                ";
                // line 81
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 81, $this->source); })()), "days", [], "any", false, false, false, 81), 'label');
                yield "
                ";
                // line 82
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 82, $this->source); })()), "days", [], "any", false, false, false, 82), 'widget');
                yield "
            </div>";
            }
            // line 85
            if ((isset($context["with_hours"]) || array_key_exists("with_hours", $context) ? $context["with_hours"] : (function () { throw new RuntimeError('Variable "with_hours" does not exist.', 85, $this->source); })())) {
                // line 86
                yield "<div class=\"col-auto\">
                ";
                // line 87
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 87, $this->source); })()), "hours", [], "any", false, false, false, 87), 'label');
                yield "
                ";
                // line 88
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 88, $this->source); })()), "hours", [], "any", false, false, false, 88), 'widget');
                yield "
            </div>";
            }
            // line 91
            if ((isset($context["with_minutes"]) || array_key_exists("with_minutes", $context) ? $context["with_minutes"] : (function () { throw new RuntimeError('Variable "with_minutes" does not exist.', 91, $this->source); })())) {
                // line 92
                yield "<div class=\"col-auto\">
                ";
                // line 93
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 93, $this->source); })()), "minutes", [], "any", false, false, false, 93), 'label');
                yield "
                ";
                // line 94
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 94, $this->source); })()), "minutes", [], "any", false, false, false, 94), 'widget');
                yield "
            </div>";
            }
            // line 97
            if ((isset($context["with_seconds"]) || array_key_exists("with_seconds", $context) ? $context["with_seconds"] : (function () { throw new RuntimeError('Variable "with_seconds" does not exist.', 97, $this->source); })())) {
                // line 98
                yield "<div class=\"col-auto\">
                ";
                // line 99
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 99, $this->source); })()), "seconds", [], "any", false, false, false, 99), 'label');
                yield "
                ";
                // line 100
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 100, $this->source); })()), "seconds", [], "any", false, false, false, 100), 'widget');
                yield "
            </div>";
            }
            // line 103
            if ((isset($context["with_invert"]) || array_key_exists("with_invert", $context) ? $context["with_invert"] : (function () { throw new RuntimeError('Variable "with_invert" does not exist.', 103, $this->source); })())) {
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 103, $this->source); })()), "invert", [], "any", false, false, false, 103), 'widget');
            }
            // line 104
            yield "</div>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 108
    public function block_percent_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "percent_widget"));

        // line 109
        if ((isset($context["symbol"]) || array_key_exists("symbol", $context) ? $context["symbol"] : (function () { throw new RuntimeError('Variable "symbol" does not exist.', 109, $this->source); })())) {
            // line 110
            yield "<div class=\"input-group\">";
            // line 111
            yield from             $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
            // line 112
            yield "<div class=\"input-group-append\">
                <span class=\"input-group-text\">";
            // line 113
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("symbol", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["symbol"]) || array_key_exists("symbol", $context) ? $context["symbol"] : (function () { throw new RuntimeError('Variable "symbol" does not exist.', 113, $this->source); })()), "%")) : ("%")), "html", null, true);
            yield "</span>
            </div>
        </div>";
        } else {
            // line 117
            yield from             $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 121
    public function block_file_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "file_widget"));

        // line 122
        yield "<";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 122, $this->source); })()), "div")) : ("div")), "html", null, true);
        yield " class=\"custom-file\">";
        // line 123
        $context["type"] = ((array_key_exists("type", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 123, $this->source); })()), "file")) : ("file"));
        // line 124
        $context["input_lang"] = "en";
        // line 125
        if ((array_key_exists("app", $context) && CoreExtension::getAttribute($this->env, $this->source, ($context["app"] ?? null), "request", [], "any", true, true, false, 125))) {
            $context["input_lang"] = CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 125, $this->source); })()), "request", [], "any", false, false, false, 125), "locale", [], "any", false, false, false, 125);
        }
        // line 126
        $context["attr"] = Twig\Extension\CoreExtension::merge(["lang" => (isset($context["input_lang"]) || array_key_exists("input_lang", $context) ? $context["input_lang"] : (function () { throw new RuntimeError('Variable "input_lang" does not exist.', 126, $this->source); })())], (isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 126, $this->source); })()));
        // line 127
        yield from         $this->unwrap()->yieldBlock("form_widget_simple", $context, $blocks);
        // line 128
        $context["label_attr"] = Twig\Extension\CoreExtension::filter($this->env, Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 128, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 128)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 128), "")) : ("")) . " custom-file-label"))]), function ($__value__, $__key__) use ($context, $macros) { $context["value"] = $__value__; $context["key"] = $__key__; return ((isset($context["key"]) || array_key_exists("key", $context) ? $context["key"] : (function () { throw new RuntimeError('Variable "key" does not exist.', 128, $this->source); })()) != "id"); });
        // line 129
        yield "<label for=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 129, $this->source); })()), "vars", [], "any", false, false, false, 129), "id", [], "any", false, false, false, 129), "html", null, true);
        yield "\" ";
        $__internal_compile_4 = $context;
        $__internal_compile_5 = ["attr" => (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 129, $this->source); })())];
        if (!is_iterable($__internal_compile_5)) {
            throw new RuntimeError('Variables passed to the "with" tag must be a hash.', 129, $this->getSourceContext());
        }
        $__internal_compile_5 = CoreExtension::toArray($__internal_compile_5);
        $context = $this->env->mergeGlobals(array_merge($context, $__internal_compile_5));
        yield from         $this->unwrap()->yieldBlock("attributes", $context, $blocks);
        $context = $__internal_compile_4;
        yield ">";
        // line 130
        if ((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "placeholder", [], "any", true, true, false, 130) &&  !(null === CoreExtension::getAttribute($this->env, $this->source, (isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 130, $this->source); })()), "placeholder", [], "any", false, false, false, 130)))) {
            // line 131
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((((isset($context["translation_domain"]) || array_key_exists("translation_domain", $context) ? $context["translation_domain"] : (function () { throw new RuntimeError('Variable "translation_domain" does not exist.', 131, $this->source); })()) === false)) ? (CoreExtension::getAttribute($this->env, $this->source, (isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 131, $this->source); })()), "placeholder", [], "any", false, false, false, 131)) : ($this->extensions['Symfony\Bridge\Twig\Extension\TranslationExtension']->trans(CoreExtension::getAttribute($this->env, $this->source, (isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 131, $this->source); })()), "placeholder", [], "any", false, false, false, 131), [], (isset($context["translation_domain"]) || array_key_exists("translation_domain", $context) ? $context["translation_domain"] : (function () { throw new RuntimeError('Variable "translation_domain" does not exist.', 131, $this->source); })())))), "html", null, true);
        }
        // line 133
        yield "</label>
    </";
        // line 134
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 134, $this->source); })()), "div")) : ("div")), "html", null, true);
        yield ">
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 137
    public function block_form_widget_simple($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_widget_simple"));

        // line 138
        if (( !array_key_exists("type", $context) || ((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 138, $this->source); })()) != "hidden"))) {
            // line 139
            $context["className"] = " form-control";
            // line 140
            if ((((array_key_exists("type", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 140, $this->source); })()), "")) : ("")) == "file")) {
                // line 141
                $context["className"] = " custom-file-input";
            } elseif ((((            // line 142
array_key_exists("type", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 142, $this->source); })()), "")) : ("")) == "range")) {
                // line 143
                $context["className"] = " form-control-range";
            }
            // line 145
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 145, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 145)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 145), "")) : ("")) . (isset($context["className"]) || array_key_exists("className", $context) ? $context["className"] : (function () { throw new RuntimeError('Variable "className" does not exist.', 145, $this->source); })())))]);
        }
        // line 147
        if ((array_key_exists("type", $context) && (((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 147, $this->source); })()) == "range") || ((isset($context["type"]) || array_key_exists("type", $context) ? $context["type"] : (function () { throw new RuntimeError('Variable "type" does not exist.', 147, $this->source); })()) == "color")))) {
            // line 148
            yield "        ";
            // line 149
            $context["required"] = false;
        }
        // line 151
        yield from $this->yieldParentBlock("form_widget_simple", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 154
    public function block_widget_attributes($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "widget_attributes"));

        // line 155
        if ( !(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 155, $this->source); })())) {
            // line 156
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 156, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 156)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 156), "")) : ("")) . " is-invalid"))]);
        }
        // line 158
        yield from $this->yieldParentBlock("widget_attributes", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 161
    public function block_button_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "button_widget"));

        // line 162
        $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 162, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 162)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 162), "btn-secondary")) : ("btn-secondary")) . " btn"))]);
        // line 163
        yield from $this->yieldParentBlock("button_widget", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 166
    public function block_submit_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "submit_widget"));

        // line 167
        $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 167, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim(((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 167)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 167), "btn-primary")) : ("btn-primary")))]);
        // line 168
        yield from $this->yieldParentBlock("submit_widget", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 171
    public function block_checkbox_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "checkbox_widget"));

        // line 172
        $context["parent_label_class"] = ((array_key_exists("parent_label_class", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 172, $this->source); })()), ((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 172)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 172), "")) : ("")))) : (((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 172)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 172), "")) : (""))));
        // line 173
        if (CoreExtension::inFilter("checkbox-custom", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 173, $this->source); })()))) {
            // line 174
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 174, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 174)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 174), "")) : ("")) . " custom-control-input"))]);
            // line 175
            yield "<div class=\"custom-control custom-checkbox";
            yield ((CoreExtension::inFilter("checkbox-inline", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 175, $this->source); })()))) ? (" custom-control-inline") : (""));
            yield "\">";
            // line 176
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 176, $this->source); })()), 'label', ["widget" => $this->renderParentBlock("checkbox_widget", $context, $blocks)]);
            // line 177
            yield "</div>";
        } elseif (CoreExtension::inFilter("switch-custom",         // line 178
(isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 178, $this->source); })()))) {
            // line 179
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 179, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 179)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 179), "")) : ("")) . " custom-control-input"))]);
            // line 180
            yield "<div class=\"custom-control custom-switch";
            yield ((CoreExtension::inFilter("switch-inline", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 180, $this->source); })()))) ? (" custom-control-inline") : (""));
            yield "\">";
            // line 181
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 181, $this->source); })()), 'label', ["widget" => $this->renderParentBlock("checkbox_widget", $context, $blocks)]);
            // line 182
            yield "</div>";
        } else {
            // line 184
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 184, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 184)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 184), "")) : ("")) . " form-check-input"))]);
            // line 185
            yield "<div class=\"form-check";
            yield ((CoreExtension::inFilter("checkbox-inline", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 185, $this->source); })()))) ? (" form-check-inline") : (""));
            yield "\">";
            // line 186
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 186, $this->source); })()), 'label', ["widget" => $this->renderParentBlock("checkbox_widget", $context, $blocks)]);
            // line 187
            yield "</div>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 191
    public function block_radio_widget($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "radio_widget"));

        // line 192
        $context["parent_label_class"] = ((array_key_exists("parent_label_class", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 192, $this->source); })()), ((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 192)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 192), "")) : ("")))) : (((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 192)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 192), "")) : (""))));
        // line 193
        if (CoreExtension::inFilter("radio-custom", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 193, $this->source); })()))) {
            // line 194
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 194, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 194)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 194), "")) : ("")) . " custom-control-input"))]);
            // line 195
            yield "<div class=\"custom-control custom-radio";
            yield ((CoreExtension::inFilter("radio-inline", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 195, $this->source); })()))) ? (" custom-control-inline") : (""));
            yield "\">";
            // line 196
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 196, $this->source); })()), 'label', ["widget" => $this->renderParentBlock("radio_widget", $context, $blocks)]);
            // line 197
            yield "</div>";
        } else {
            // line 199
            $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 199, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 199)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 199), "")) : ("")) . " form-check-input"))]);
            // line 200
            yield "<div class=\"form-check";
            yield ((CoreExtension::inFilter("radio-inline", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 200, $this->source); })()))) ? (" form-check-inline") : (""));
            yield "\">";
            // line 201
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 201, $this->source); })()), 'label', ["widget" => $this->renderParentBlock("radio_widget", $context, $blocks)]);
            // line 202
            yield "</div>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 206
    public function block_choice_widget_collapsed($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "choice_widget_collapsed"));

        // line 207
        $context["attr"] = Twig\Extension\CoreExtension::merge((isset($context["attr"]) || array_key_exists("attr", $context) ? $context["attr"] : (function () { throw new RuntimeError('Variable "attr" does not exist.', 207, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", true, true, false, 207)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["attr"] ?? null), "class", [], "any", false, false, false, 207), "")) : ("")) . " form-control"))]);
        // line 208
        yield from $this->yieldParentBlock("choice_widget_collapsed", $context, $blocks);
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 211
    public function block_choice_widget_expanded($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "choice_widget_expanded"));

        // line 212
        yield "<div ";
        yield from         $this->unwrap()->yieldBlock("widget_container_attributes", $context, $blocks);
        yield ">";
        // line 213
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 213, $this->source); })()));
        foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
            // line 214
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock($context["child"], 'widget', ["parent_label_class" => ((CoreExtension::getAttribute($this->env, $this->source,             // line 215
($context["label_attr"] ?? null), "class", [], "any", true, true, false, 215)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 215), "")) : ("")), "translation_domain" =>             // line 216
(isset($context["choice_translation_domain"]) || array_key_exists("choice_translation_domain", $context) ? $context["choice_translation_domain"] : (function () { throw new RuntimeError('Variable "choice_translation_domain" does not exist.', 216, $this->source); })()), "valid" =>             // line 217
(isset($context["valid"]) || array_key_exists("valid", $context) ? $context["valid"] : (function () { throw new RuntimeError('Variable "valid" does not exist.', 217, $this->source); })())]);
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 220
        yield "</div>";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 225
    public function block_form_label($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_label"));

        // line 226
        if ( !((isset($context["label"]) || array_key_exists("label", $context) ? $context["label"] : (function () { throw new RuntimeError('Variable "label" does not exist.', 226, $this->source); })()) === false)) {
            // line 227
            if ((array_key_exists("compound", $context) && (isset($context["compound"]) || array_key_exists("compound", $context) ? $context["compound"] : (function () { throw new RuntimeError('Variable "compound" does not exist.', 227, $this->source); })()))) {
                // line 228
                $context["element"] = "legend";
                // line 229
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 229, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 229)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 229), "")) : ("")) . " col-form-label"))]);
            } else {
                // line 231
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 231, $this->source); })()), ["for" => (isset($context["id"]) || array_key_exists("id", $context) ? $context["id"] : (function () { throw new RuntimeError('Variable "id" does not exist.', 231, $this->source); })())]);
            }
            // line 233
            if ((isset($context["required"]) || array_key_exists("required", $context) ? $context["required"] : (function () { throw new RuntimeError('Variable "required" does not exist.', 233, $this->source); })())) {
                // line 234
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 234, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 234)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 234), "")) : ("")) . " required"))]);
            }
            // line 236
            yield "<";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 236, $this->source); })()), "label")) : ("label")), "html", null, true);
            if ((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 236, $this->source); })())) {
                $__internal_compile_6 = $context;
                $__internal_compile_7 = ["attr" => (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 236, $this->source); })())];
                if (!is_iterable($__internal_compile_7)) {
                    throw new RuntimeError('Variables passed to the "with" tag must be a hash.', 236, $this->getSourceContext());
                }
                $__internal_compile_7 = CoreExtension::toArray($__internal_compile_7);
                $context = $this->env->mergeGlobals(array_merge($context, $__internal_compile_7));
                yield from                 $this->unwrap()->yieldBlock("attributes", $context, $blocks);
                $context = $__internal_compile_6;
            }
            yield ">";
            // line 237
            yield from             $this->unwrap()->yieldBlock("form_label_content", $context, $blocks);
            // line 238
            yield from $this->unwrap()->yieldBlock('form_label_errors', $context, $blocks);
            yield "</";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 238, $this->source); })()), "label")) : ("label")), "html", null, true);
            yield ">";
        } else {
            // line 240
            if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), (isset($context["errors"]) || array_key_exists("errors", $context) ? $context["errors"] : (function () { throw new RuntimeError('Variable "errors" does not exist.', 240, $this->source); })())) > 0)) {
                // line 241
                yield "<div id=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["id"]) || array_key_exists("id", $context) ? $context["id"] : (function () { throw new RuntimeError('Variable "id" does not exist.', 241, $this->source); })()), "html", null, true);
                yield "_errors\" class=\"mb-2\">";
                // line 242
                yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 242, $this->source); })()), 'errors');
                // line 243
                yield "</div>";
            }
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 238
    public function block_form_label_errors($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_label_errors"));

        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 238, $this->source); })()), 'errors');
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 248
    public function block_checkbox_radio_label($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "checkbox_radio_label"));

        // line 250
        if (array_key_exists("widget", $context)) {
            // line 251
            $context["is_parent_custom"] = (array_key_exists("parent_label_class", $context) && ((CoreExtension::inFilter("checkbox-custom", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 251, $this->source); })())) || CoreExtension::inFilter("radio-custom", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 251, $this->source); })()))) || CoreExtension::inFilter("switch-custom", (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 251, $this->source); })()))));
            // line 252
            yield "        ";
            $context["is_custom"] = (CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 252) && ((CoreExtension::inFilter("checkbox-custom", CoreExtension::getAttribute($this->env, $this->source, (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 252, $this->source); })()), "class", [], "any", false, false, false, 252)) || CoreExtension::inFilter("radio-custom", CoreExtension::getAttribute($this->env, $this->source, (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 252, $this->source); })()), "class", [], "any", false, false, false, 252))) || CoreExtension::inFilter("switch-custom", CoreExtension::getAttribute($this->env, $this->source, (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 252, $this->source); })()), "class", [], "any", false, false, false, 252))));
            // line 253
            if (((isset($context["is_parent_custom"]) || array_key_exists("is_parent_custom", $context) ? $context["is_parent_custom"] : (function () { throw new RuntimeError('Variable "is_parent_custom" does not exist.', 253, $this->source); })()) || (isset($context["is_custom"]) || array_key_exists("is_custom", $context) ? $context["is_custom"] : (function () { throw new RuntimeError('Variable "is_custom" does not exist.', 253, $this->source); })()))) {
                // line 254
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 254, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 254)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 254), "")) : ("")) . " custom-control-label"))]);
            } else {
                // line 256
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 256, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 256)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 256), "")) : ("")) . " form-check-label"))]);
            }
            // line 258
            if ( !(isset($context["compound"]) || array_key_exists("compound", $context) ? $context["compound"] : (function () { throw new RuntimeError('Variable "compound" does not exist.', 258, $this->source); })())) {
                // line 259
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 259, $this->source); })()), ["for" => (isset($context["id"]) || array_key_exists("id", $context) ? $context["id"] : (function () { throw new RuntimeError('Variable "id" does not exist.', 259, $this->source); })())]);
            }
            // line 261
            if ((isset($context["required"]) || array_key_exists("required", $context) ? $context["required"] : (function () { throw new RuntimeError('Variable "required" does not exist.', 261, $this->source); })())) {
                // line 262
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 262, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 262)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 262), "")) : ("")) . " required"))]);
            }
            // line 264
            if (array_key_exists("parent_label_class", $context)) {
                // line 265
                $context["embed_label_classes"] = Twig\Extension\CoreExtension::filter($this->env, Twig\Extension\CoreExtension::split($this->env->getCharset(), (isset($context["parent_label_class"]) || array_key_exists("parent_label_class", $context) ? $context["parent_label_class"] : (function () { throw new RuntimeError('Variable "parent_label_class" does not exist.', 265, $this->source); })()), " "), function ($__class__) use ($context, $macros) { $context["class"] = $__class__; return CoreExtension::inFilter((isset($context["class"]) || array_key_exists("class", $context) ? $context["class"] : (function () { throw new RuntimeError('Variable "class" does not exist.', 265, $this->source); })()), ["checkbox-inline", "radio-inline"]); });
                // line 266
                $context["label_attr"] = Twig\Extension\CoreExtension::merge((isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 266, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim(((((CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", true, true, false, 266)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["label_attr"] ?? null), "class", [], "any", false, false, false, 266), "")) : ("")) . " ") . Twig\Extension\CoreExtension::join((isset($context["embed_label_classes"]) || array_key_exists("embed_label_classes", $context) ? $context["embed_label_classes"] : (function () { throw new RuntimeError('Variable "embed_label_classes" does not exist.', 266, $this->source); })()), " ")))]);
            }
            // line 268
            yield "
        ";
            // line 269
            yield (isset($context["widget"]) || array_key_exists("widget", $context) ? $context["widget"] : (function () { throw new RuntimeError('Variable "widget" does not exist.', 269, $this->source); })());
            yield "
        <label";
            // line 270
            $__internal_compile_8 = $context;
            $__internal_compile_9 = ["attr" => (isset($context["label_attr"]) || array_key_exists("label_attr", $context) ? $context["label_attr"] : (function () { throw new RuntimeError('Variable "label_attr" does not exist.', 270, $this->source); })())];
            if (!is_iterable($__internal_compile_9)) {
                throw new RuntimeError('Variables passed to the "with" tag must be a hash.', 270, $this->getSourceContext());
            }
            $__internal_compile_9 = CoreExtension::toArray($__internal_compile_9);
            $context = $this->env->mergeGlobals(array_merge($context, $__internal_compile_9));
            yield from             $this->unwrap()->yieldBlock("attributes", $context, $blocks);
            $context = $__internal_compile_8;
            yield ">";
            // line 271
            if ( !((isset($context["label"]) || array_key_exists("label", $context) ? $context["label"] : (function () { throw new RuntimeError('Variable "label" does not exist.', 271, $this->source); })()) === false)) {
                // line 272
                yield from                 $this->unwrap()->yieldBlock("form_label_content", $context, $blocks);
            }
            // line 274
            yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 274, $this->source); })()), 'errors');
            // line 275
            yield "</label>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 281
    public function block_form_row($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_row"));

        // line 282
        if ((array_key_exists("compound", $context) && (isset($context["compound"]) || array_key_exists("compound", $context) ? $context["compound"] : (function () { throw new RuntimeError('Variable "compound" does not exist.', 282, $this->source); })()))) {
            // line 283
            $context["element"] = "fieldset";
        }
        // line 285
        $context["widget_attr"] = [];
        // line 286
        if ( !Twig\Extension\CoreExtension::testEmpty((isset($context["help"]) || array_key_exists("help", $context) ? $context["help"] : (function () { throw new RuntimeError('Variable "help" does not exist.', 286, $this->source); })()))) {
            // line 287
            $context["widget_attr"] = ["attr" => ["aria-describedby" => ((isset($context["id"]) || array_key_exists("id", $context) ? $context["id"] : (function () { throw new RuntimeError('Variable "id" does not exist.', 287, $this->source); })()) . "_help")]];
        }
        // line 289
        yield "<";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 289, $this->source); })()), "div")) : ("div")), "html", null, true);
        $__internal_compile_10 = $context;
        $__internal_compile_11 = ["attr" => Twig\Extension\CoreExtension::merge((isset($context["row_attr"]) || array_key_exists("row_attr", $context) ? $context["row_attr"] : (function () { throw new RuntimeError('Variable "row_attr" does not exist.', 289, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["row_attr"] ?? null), "class", [], "any", true, true, false, 289)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["row_attr"] ?? null), "class", [], "any", false, false, false, 289), "")) : ("")) . " form-group"))])];
        if (!is_iterable($__internal_compile_11)) {
            throw new RuntimeError('Variables passed to the "with" tag must be a hash.', 289, $this->getSourceContext());
        }
        $__internal_compile_11 = CoreExtension::toArray($__internal_compile_11);
        $context = $this->env->mergeGlobals(array_merge($context, $__internal_compile_11));
        yield from         $this->unwrap()->yieldBlock("attributes", $context, $blocks);
        $context = $__internal_compile_10;
        yield ">";
        // line 290
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 290, $this->source); })()), 'label');
        // line 291
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 291, $this->source); })()), 'widget', (isset($context["widget_attr"]) || array_key_exists("widget_attr", $context) ? $context["widget_attr"] : (function () { throw new RuntimeError('Variable "widget_attr" does not exist.', 291, $this->source); })()));
        // line 292
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 292, $this->source); })()), 'help');
        // line 293
        yield "</";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((array_key_exists("element", $context)) ? (Twig\Extension\CoreExtension::default((isset($context["element"]) || array_key_exists("element", $context) ? $context["element"] : (function () { throw new RuntimeError('Variable "element" does not exist.', 293, $this->source); })()), "div")) : ("div")), "html", null, true);
        yield ">";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 298
    public function block_form_errors($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_errors"));

        // line 299
        if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), (isset($context["errors"]) || array_key_exists("errors", $context) ? $context["errors"] : (function () { throw new RuntimeError('Variable "errors" does not exist.', 299, $this->source); })())) > 0)) {
            // line 300
            yield "<span class=\"";
            if ( !Symfony\Bridge\Twig\Extension\twig_is_root_form((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 300, $this->source); })()))) {
                yield "invalid-feedback";
            } else {
                yield "alert alert-danger";
            }
            yield " d-block\">";
            // line 301
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable((isset($context["errors"]) || array_key_exists("errors", $context) ? $context["errors"] : (function () { throw new RuntimeError('Variable "errors" does not exist.', 301, $this->source); })()));
            foreach ($context['_seq'] as $context["_key"] => $context["error"]) {
                // line 302
                yield "<span class=\"d-block\">
                    <span class=\"form-error-icon badge badge-danger text-uppercase\">";
                // line 303
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\TranslationExtension']->trans("Error", [], "validators"), "html", null, true);
                yield "</span> <span class=\"form-error-message\">";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["error"], "message", [], "any", false, false, false, 303), "html", null, true);
                yield "</span>
                </span>";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['error'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 306
            yield "</span>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 312
    public function block_form_help($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "form_help"));

        // line 313
        if ( !Twig\Extension\CoreExtension::testEmpty((isset($context["help"]) || array_key_exists("help", $context) ? $context["help"] : (function () { throw new RuntimeError('Variable "help" does not exist.', 313, $this->source); })()))) {
            // line 314
            $context["help_attr"] = Twig\Extension\CoreExtension::merge((isset($context["help_attr"]) || array_key_exists("help_attr", $context) ? $context["help_attr"] : (function () { throw new RuntimeError('Variable "help_attr" does not exist.', 314, $this->source); })()), ["class" => Twig\Extension\CoreExtension::trim((((CoreExtension::getAttribute($this->env, $this->source, ($context["help_attr"] ?? null), "class", [], "any", true, true, false, 314)) ? (Twig\Extension\CoreExtension::default(CoreExtension::getAttribute($this->env, $this->source, ($context["help_attr"] ?? null), "class", [], "any", false, false, false, 314), "")) : ("")) . " form-text text-muted"))]);
            // line 315
            yield "<small id=\"";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["id"]) || array_key_exists("id", $context) ? $context["id"] : (function () { throw new RuntimeError('Variable "id" does not exist.', 315, $this->source); })()), "html", null, true);
            yield "_help\"";
            $__internal_compile_12 = $context;
            $__internal_compile_13 = ["attr" => (isset($context["help_attr"]) || array_key_exists("help_attr", $context) ? $context["help_attr"] : (function () { throw new RuntimeError('Variable "help_attr" does not exist.', 315, $this->source); })())];
            if (!is_iterable($__internal_compile_13)) {
                throw new RuntimeError('Variables passed to the "with" tag must be a hash.', 315, $this->getSourceContext());
            }
            $__internal_compile_13 = CoreExtension::toArray($__internal_compile_13);
            $context = $this->env->mergeGlobals(array_merge($context, $__internal_compile_13));
            yield from             $this->unwrap()->yieldBlock("attributes", $context, $blocks);
            $context = $__internal_compile_12;
            yield ">";
            // line 316
            yield from             $this->unwrap()->yieldBlock("form_help_content", $context, $blocks);
            // line 317
            yield "</small>";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "bootstrap_4_layout.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  1037 => 317,  1035 => 316,  1021 => 315,  1019 => 314,  1017 => 313,  1010 => 312,  1001 => 306,  991 => 303,  988 => 302,  984 => 301,  976 => 300,  974 => 299,  967 => 298,  957 => 293,  955 => 292,  953 => 291,  951 => 290,  938 => 289,  935 => 287,  933 => 286,  931 => 285,  928 => 283,  926 => 282,  919 => 281,  910 => 275,  908 => 274,  905 => 272,  903 => 271,  892 => 270,  888 => 269,  885 => 268,  882 => 266,  880 => 265,  878 => 264,  875 => 262,  873 => 261,  870 => 259,  868 => 258,  865 => 256,  862 => 254,  860 => 253,  857 => 252,  855 => 251,  853 => 250,  846 => 248,  832 => 238,  822 => 243,  820 => 242,  816 => 241,  814 => 240,  808 => 238,  806 => 237,  791 => 236,  788 => 234,  786 => 233,  783 => 231,  780 => 229,  778 => 228,  776 => 227,  774 => 226,  767 => 225,  759 => 220,  753 => 217,  752 => 216,  751 => 215,  750 => 214,  746 => 213,  742 => 212,  735 => 211,  727 => 208,  725 => 207,  718 => 206,  709 => 202,  707 => 201,  703 => 200,  701 => 199,  698 => 197,  696 => 196,  692 => 195,  690 => 194,  688 => 193,  686 => 192,  679 => 191,  670 => 187,  668 => 186,  664 => 185,  662 => 184,  659 => 182,  657 => 181,  653 => 180,  651 => 179,  649 => 178,  647 => 177,  645 => 176,  641 => 175,  639 => 174,  637 => 173,  635 => 172,  628 => 171,  620 => 168,  618 => 167,  611 => 166,  603 => 163,  601 => 162,  594 => 161,  586 => 158,  583 => 156,  581 => 155,  574 => 154,  566 => 151,  563 => 149,  561 => 148,  559 => 147,  556 => 145,  553 => 143,  551 => 142,  549 => 141,  547 => 140,  545 => 139,  543 => 138,  536 => 137,  526 => 134,  523 => 133,  520 => 131,  518 => 130,  504 => 129,  502 => 128,  500 => 127,  498 => 126,  494 => 125,  492 => 124,  490 => 123,  486 => 122,  479 => 121,  470 => 117,  464 => 113,  461 => 112,  459 => 111,  457 => 110,  455 => 109,  448 => 108,  439 => 104,  435 => 103,  430 => 100,  426 => 99,  423 => 98,  421 => 97,  416 => 94,  412 => 93,  409 => 92,  407 => 91,  402 => 88,  398 => 87,  395 => 86,  393 => 85,  388 => 82,  384 => 81,  381 => 80,  379 => 79,  374 => 76,  370 => 75,  367 => 74,  365 => 73,  360 => 70,  356 => 69,  353 => 68,  351 => 67,  346 => 64,  342 => 63,  339 => 62,  337 => 61,  333 => 60,  331 => 59,  328 => 57,  326 => 56,  323 => 54,  321 => 53,  319 => 52,  312 => 51,  304 => 48,  301 => 46,  299 => 45,  297 => 44,  290 => 43,  282 => 40,  279 => 38,  277 => 37,  275 => 36,  268 => 35,  260 => 32,  257 => 30,  255 => 29,  253 => 28,  246 => 27,  237 => 23,  234 => 21,  229 => 18,  226 => 17,  224 => 16,  222 => 15,  217 => 12,  214 => 11,  212 => 10,  208 => 9,  206 => 8,  204 => 7,  202 => 6,  195 => 5,  187 => 312,  184 => 311,  181 => 309,  179 => 298,  176 => 297,  173 => 295,  171 => 281,  168 => 280,  165 => 278,  163 => 248,  160 => 247,  158 => 225,  155 => 224,  152 => 222,  150 => 211,  147 => 210,  145 => 206,  142 => 205,  140 => 191,  137 => 190,  135 => 171,  132 => 170,  130 => 166,  127 => 165,  125 => 161,  122 => 160,  120 => 154,  117 => 153,  115 => 137,  112 => 136,  110 => 121,  107 => 120,  105 => 108,  102 => 107,  100 => 51,  97 => 50,  95 => 43,  92 => 42,  90 => 35,  87 => 34,  85 => 27,  82 => 26,  80 => 5,  77 => 4,  74 => 2,  31 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% use \"bootstrap_base_layout.html.twig\" %}

{# Widgets #}

{% block money_widget -%}
    {%- set prepend = not (money_pattern starts with '{{') -%}
    {%- set append = not (money_pattern ends with '}}') -%}
    {%- if prepend or append -%}
        <div class=\"input-group {{ group_class|default('') }}\">
            {%- if prepend -%}
                <div class=\"input-group-prepend\">
                    <span class=\"input-group-text\">{{ money_pattern|form_encode_currency }}</span>
                </div>
            {%- endif -%}
            {{- block('form_widget_simple') -}}
            {%- if append -%}
                <div class=\"input-group-append\">
                    <span class=\"input-group-text\">{{ money_pattern|form_encode_currency }}</span>
                </div>
            {%- endif -%}
        </div>
    {%- else -%}
        {{- block('form_widget_simple') -}}
    {%- endif -%}
{%- endblock money_widget %}

{% block datetime_widget -%}
    {%- if widget != 'single_text' and not valid -%}
        {% set attr = attr|merge({class: (attr.class|default('') ~ ' form-control is-invalid')|trim}) -%}
        {% set valid = true %}
    {%- endif -%}
    {{- parent() -}}
{%- endblock datetime_widget %}

{% block date_widget -%}
    {%- if widget != 'single_text' and not valid -%}
        {% set attr = attr|merge({class: (attr.class|default('') ~ ' form-control is-invalid')|trim}) -%}
        {% set valid = true %}
    {%- endif -%}
    {{- parent() -}}
{%- endblock date_widget %}

{% block time_widget -%}
    {%- if widget != 'single_text' and not valid -%}
        {% set attr = attr|merge({class: (attr.class|default('') ~ ' form-control is-invalid')|trim}) -%}
        {% set valid = true %}
    {%- endif -%}
    {{- parent() -}}
{%- endblock time_widget %}

{% block dateinterval_widget -%}
    {%- if widget != 'single_text' and not valid -%}
        {% set attr = attr|merge({class: (attr.class|default('') ~ ' form-control is-invalid')|trim}) -%}
        {% set valid = true %}
    {%- endif -%}
    {%- if widget == 'single_text' -%}
        {{- block('form_widget_simple') -}}
    {%- else -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' form-inline')|trim}) -%}
        <div {{ block('widget_container_attributes') }}>
            {%- if with_years -%}
            <div class=\"col-auto\">
                {{ form_label(form.years) }}
                {{ form_widget(form.years) }}
            </div>
            {%- endif -%}
            {%- if with_months -%}
            <div class=\"col-auto\">
                {{ form_label(form.months) }}
                {{ form_widget(form.months) }}
            </div>
            {%- endif -%}
            {%- if with_weeks -%}
            <div class=\"col-auto\">
                {{ form_label(form.weeks) }}
                {{ form_widget(form.weeks) }}
            </div>
            {%- endif -%}
            {%- if with_days -%}
            <div class=\"col-auto\">
                {{ form_label(form.days) }}
                {{ form_widget(form.days) }}
            </div>
            {%- endif -%}
            {%- if with_hours -%}
            <div class=\"col-auto\">
                {{ form_label(form.hours) }}
                {{ form_widget(form.hours) }}
            </div>
            {%- endif -%}
            {%- if with_minutes -%}
            <div class=\"col-auto\">
                {{ form_label(form.minutes) }}
                {{ form_widget(form.minutes) }}
            </div>
            {%- endif -%}
            {%- if with_seconds -%}
            <div class=\"col-auto\">
                {{ form_label(form.seconds) }}
                {{ form_widget(form.seconds) }}
            </div>
            {%- endif -%}
            {%- if with_invert %}{{ form_widget(form.invert) }}{% endif -%}
        </div>
    {%- endif -%}
{%- endblock dateinterval_widget %}

{% block percent_widget -%}
    {%- if symbol -%}
        <div class=\"input-group\">
            {{- block('form_widget_simple') -}}
            <div class=\"input-group-append\">
                <span class=\"input-group-text\">{{ symbol|default('%') }}</span>
            </div>
        </div>
    {%- else -%}
        {{- block('form_widget_simple') -}}
    {%- endif -%}
{%- endblock percent_widget %}

{% block file_widget -%}
    <{{ element|default('div') }} class=\"custom-file\">
        {%- set type = type|default('file') -%}
        {%- set input_lang = 'en' -%}
        {% if app is defined and app.request is defined %}{%- set input_lang = app.request.locale -%}{%- endif -%}
        {%- set attr = {lang: input_lang} | merge(attr) -%}
        {{- block('form_widget_simple') -}}
        {%- set label_attr = label_attr|merge({ class: (label_attr.class|default('') ~ ' custom-file-label')|trim })|filter((value, key) => key != 'id') -%}
        <label for=\"{{ form.vars.id }}\" {% with { attr: label_attr } %}{{ block('attributes') }}{% endwith %}>
            {%- if attr.placeholder is defined and attr.placeholder is not none -%}
                {{- translation_domain is same as(false) ? attr.placeholder : attr.placeholder|trans({}, translation_domain) -}}
            {%- endif -%}
        </label>
    </{{ element|default('div') }}>
{% endblock %}

{% block form_widget_simple -%}
    {%- if type is not defined or type != 'hidden' -%}
        {%- set className = ' form-control' -%}
        {%- if type|default('') == 'file' -%}
            {%- set className = ' custom-file-input' -%}
        {%- elseif type|default('') == 'range' -%}
            {%- set className = ' form-control-range' -%}
        {%- endif -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ className)|trim}) -%}
    {%- endif -%}
    {%- if type is defined and (type == 'range' or type == 'color') %}
        {# Attribute \"required\" is not supported #}
        {%- set required = false -%}
    {% endif %}
    {{- parent() -}}
{%- endblock form_widget_simple %}

{% block widget_attributes -%}
    {%- if not valid -%}
        {% set attr = attr|merge({class: (attr.class|default('') ~ ' is-invalid')|trim}) %}
    {%- endif -%}
    {{ parent() }}
{%- endblock widget_attributes %}

{% block button_widget -%}
    {%- set attr = attr|merge({class: (attr.class|default('btn-secondary') ~ ' btn')|trim}) -%}
    {{- parent() -}}
{%- endblock button_widget %}

{% block submit_widget -%}
    {%- set attr = attr|merge({class: (attr.class|default('btn-primary'))|trim}) -%}
    {{- parent() -}}
{%- endblock submit_widget %}

{% block checkbox_widget -%}
    {%- set parent_label_class = parent_label_class|default(label_attr.class|default('')) -%}
    {%- if 'checkbox-custom' in parent_label_class -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' custom-control-input')|trim}) -%}
        <div class=\"custom-control custom-checkbox{{ 'checkbox-inline' in parent_label_class ? ' custom-control-inline' }}\">
            {{- form_label(form, null, { widget: parent() }) -}}
        </div>
    {%- elseif 'switch-custom' in parent_label_class -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' custom-control-input')|trim}) -%}
        <div class=\"custom-control custom-switch{{ 'switch-inline' in parent_label_class ? ' custom-control-inline' }}\">
            {{- form_label(form, null, { widget: parent() }) -}}
        </div>
    {%- else -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' form-check-input')|trim}) -%}
        <div class=\"form-check{{ 'checkbox-inline' in parent_label_class ? ' form-check-inline' }}\">
            {{- form_label(form, null, { widget: parent() }) -}}
        </div>
    {%- endif -%}
{%- endblock checkbox_widget %}

{% block radio_widget -%}
    {%- set parent_label_class = parent_label_class|default(label_attr.class|default('')) -%}
    {%- if 'radio-custom' in parent_label_class -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' custom-control-input')|trim}) -%}
        <div class=\"custom-control custom-radio{{ 'radio-inline' in parent_label_class ? ' custom-control-inline' }}\">
            {{- form_label(form, null, { widget: parent() }) -}}
        </div>
    {%- else -%}
        {%- set attr = attr|merge({class: (attr.class|default('') ~ ' form-check-input')|trim}) -%}
        <div class=\"form-check{{ 'radio-inline' in parent_label_class ? ' form-check-inline' }}\">
            {{- form_label(form, null, { widget: parent() }) -}}
        </div>
    {%- endif -%}
{%- endblock radio_widget %}

{% block choice_widget_collapsed -%}
    {%- set attr = attr|merge({class: (attr.class|default('') ~ ' form-control')|trim}) -%}
    {{- parent() -}}
{%- endblock choice_widget_collapsed %}

{% block choice_widget_expanded -%}
    <div {{ block('widget_container_attributes') }}>
        {%- for child in form %}
            {{- form_widget(child, {
                parent_label_class: label_attr.class|default(''),
                translation_domain: choice_translation_domain,
                valid: valid,
            }) -}}
        {% endfor -%}
    </div>
{%- endblock choice_widget_expanded %}

{# Labels #}

{% block form_label -%}
    {% if label is not same as(false) -%}
        {%- if compound is defined and compound -%}
            {%- set element = 'legend' -%}
            {%- set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' col-form-label')|trim}) -%}
        {%- else -%}
            {%- set label_attr = label_attr|merge({for: id}) -%}
        {%- endif -%}
        {% if required -%}
            {% set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' required')|trim}) %}
        {%- endif -%}
        <{{ element|default('label') }}{% if label_attr %}{% with { attr: label_attr } %}{{ block('attributes') }}{% endwith %}{% endif %}>
        {{- block('form_label_content') -}}
        {% block form_label_errors %}{{- form_errors(form) -}}{% endblock form_label_errors %}</{{ element|default('label') }}>
    {%- else -%}
        {%- if errors|length > 0 -%}
        <div id=\"{{ id }}_errors\" class=\"mb-2\">
            {{- form_errors(form) -}}
        </div>
        {%- endif -%}
    {%- endif -%}
{%- endblock form_label %}

{% block checkbox_radio_label -%}
    {#- Do not display the label if widget is not defined in order to prevent double label rendering -#}
    {%- if widget is defined -%}
        {% set is_parent_custom = parent_label_class is defined and ('checkbox-custom' in parent_label_class or 'radio-custom' in parent_label_class or 'switch-custom' in parent_label_class) %}
        {% set is_custom = label_attr.class is defined and ('checkbox-custom' in label_attr.class or 'radio-custom' in label_attr.class or 'switch-custom' in label_attr.class) %}
        {%- if is_parent_custom or is_custom -%}
            {%- set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' custom-control-label')|trim}) -%}
        {%- else %}
            {%- set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' form-check-label')|trim}) -%}
        {%- endif %}
        {%- if not compound -%}
            {% set label_attr = label_attr|merge({'for': id}) %}
        {%- endif -%}
        {%- if required -%}
            {%- set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' required')|trim}) -%}
        {%- endif -%}
        {%- if parent_label_class is defined -%}
            {% set embed_label_classes = parent_label_class|split(' ')|filter(class => class in ['checkbox-inline', 'radio-inline']) %}
            {%- set label_attr = label_attr|merge({class: (label_attr.class|default('') ~ ' ' ~ embed_label_classes|join(' '))|trim}) -%}
        {% endif %}

        {{ widget|raw }}
        <label{% with { attr: label_attr } %}{{ block('attributes') }}{% endwith %}>
            {%- if label is not same as(false) -%}
                {{- block('form_label_content') -}}
            {%- endif -%}
            {{- form_errors(form) -}}
        </label>
    {%- endif -%}
{%- endblock checkbox_radio_label %}

{# Rows #}

{% block form_row -%}
    {%- if compound is defined and compound -%}
        {%- set element = 'fieldset' -%}
    {%- endif -%}
    {%- set widget_attr = {} -%}
    {%- if help is not empty -%}
        {%- set widget_attr = {attr: {'aria-describedby': id ~\"_help\"}} -%}
    {%- endif -%}
    <{{ element|default('div') }}{% with {attr: row_attr|merge({class: (row_attr.class|default('') ~ ' form-group')|trim})} %}{{ block('attributes') }}{% endwith %}>
        {{- form_label(form) -}}
        {{- form_widget(form, widget_attr) -}}
        {{- form_help(form) -}}
    </{{ element|default('div') }}>
{%- endblock form_row %}

{# Errors #}

{% block form_errors -%}
    {%- if errors|length > 0 -%}
        <span class=\"{% if form is not rootform %}invalid-feedback{% else %}alert alert-danger{% endif %} d-block\">
            {%- for error in errors -%}
                <span class=\"d-block\">
                    <span class=\"form-error-icon badge badge-danger text-uppercase\">{{ 'Error'|trans({}, 'validators') }}</span> <span class=\"form-error-message\">{{ error.message }}</span>
                </span>
            {%- endfor -%}
        </span>
    {%- endif %}
{%- endblock form_errors %}

{# Help #}

{% block form_help -%}
    {%- if help is not empty -%}
        {%- set help_attr = help_attr|merge({class: (help_attr.class|default('') ~ ' form-text text-muted')|trim}) -%}
        <small id=\"{{ id }}_help\"{% with { attr: help_attr } %}{{ block('attributes') }}{% endwith %}>
            {{- block('form_help_content') -}}
        </small>
    {%- endif -%}
{%- endblock form_help %}
", "bootstrap_4_layout.html.twig", "/var/www/symfony_docker/vendor/symfony/twig-bridge/Resources/views/Form/bootstrap_4_layout.html.twig");
    }
}
